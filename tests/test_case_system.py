import json
import tempfile
import unittest
from pathlib import Path

from flask import Flask

from case_system.core import CaseAIOrchestrator, CaseStore, CourtAIPredictor
from case_system.flask_api import create_case_blueprint, create_court_ai_blueprint


class CaseSystemTest(unittest.TestCase):
    def test_case_material_knowledge_redaction_and_verification_flow(self):
        with tempfile.TemporaryDirectory() as tmp:
            orchestrator = CaseAIOrchestrator(CaseStore(tmp), knowledge_roots=[])
            matter = orchestrator.store.create_matter("买卖合同纠纷", team_id="litigation")

            first = orchestrator.materials.add_material(
                matter.matter_id,
                text="上海甲科技有限公司签署合同后交付货物。",
                title="合同事实",
            )
            second = orchestrator.materials.add_material(
                matter.matter_id,
                text="上海甲科技有限公司签署合同后交付货物，北京乙贸易有限公司仍欠款100万元。",
                title="合同事实",
            )
            self.assertEqual(first["version"], 1)
            self.assertEqual(second["version"], 2)
            self.assertEqual(len(orchestrator.materials.latest_materials(matter.matter_id)), 1)

            inactive = orchestrator.knowledge.add_knowledge(
                matter.matter_id,
                title="旧版裁判观点",
                text="该观点已废止，不再适用。",
            )
            active = orchestrator.knowledge.add_knowledge(
                matter.matter_id,
                title="买卖合同裁判规则",
                text="合同原件、交付凭证、付款流水可共同证明交易事实。",
            )
            self.assertEqual(inactive["validity_status"], "inactive")

            orchestrator.memory.add_rule(matter.matter_id, "代理意见应围绕争议焦点，结合事实、证据与法律依据展开论证，避免机械套用固定格式。")
            plan = orchestrator.plan_task(matter.matter_id, "生成庭后代理意见，强调付款违约责任")
            self.assertEqual(plan["route"]["document_type"], "agency_opinion")
            self.assertEqual(len(plan["materials"]), 1)
            self.assertTrue(all(item["owner_id"] != inactive["knowledge_id"] for item in plan["knowledge"]))

            payload = orchestrator.prepare_model_payload(matter.matter_id, "生成庭后代理意见")
            mapping = json.loads(Path(payload["mapping_path"]).read_text(encoding="utf-8"))
            company_mapping = next(
                item
                for item in mapping["mappings"]
                if item["entity_type"] == "company_name" and item["redacted"] != item["original"]
            )
            restored = orchestrator.restore_model_output(
                payload["mapping_path"],
                f"{company_mapping['redacted']}应承担付款责任。",
            )
            self.assertIn(company_mapping["original"], restored["restored_text"])

            verified = orchestrator.verifier.verify(
                matter.matter_id,
                [{"source_id": active["knowledge_id"], "quote": "合同原件、交付凭证、付款流水"}],
            )
            self.assertTrue(verified["all_verified"])

    def test_agent_automatically_selects_global_knowledge_files(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "kb"
            root.mkdir()
            source = root / "data-outbound-guide.md"
            source.write_text(
                "# 数据出境指南\n\n个人信息出境前应完成影响评估，并保存评估报告和合同记录。",
                encoding="utf-8",
            )
            orchestrator = CaseAIOrchestrator(CaseStore(Path(tmp) / "store"), knowledge_roots=[root])
            matter = orchestrator.store.create_matter("数据出境合规")

            plan = orchestrator.plan_task(matter.matter_id, "生成个人信息出境合规报告")
            global_items = [item for item in plan["knowledge"] if item["owner_type"] == "global_knowledge"]
            self.assertTrue(global_items)
            self.assertEqual(global_items[0]["metadata"]["source_path"], str(source.resolve()))

            payload = orchestrator.prepare_model_payload(matter.matter_id, "生成个人信息出境合规报告")
            self.assertIn("source_path", payload["redacted_payload"])
            self.assertIn("个人信息出境前应完成影响评估", payload["redacted_payload"])

            verified = orchestrator.verifier.verify(
                matter.matter_id,
                [{"source_id": global_items[0]["owner_id"], "quote": "个人信息出境前应完成影响评估"}],
            )
            self.assertTrue(verified["all_verified"])

    def test_flask_blueprints_expose_case_and_court_ai_apis(self):
        with tempfile.TemporaryDirectory() as tmp:
            app = Flask(__name__)
            app.register_blueprint(create_case_blueprint(tmp, knowledge_roots=[]))
            app.register_blueprint(create_court_ai_blueprint())
            client = app.test_client()

            created = client.post("/api/cases", json={"name": "测试案件"})
            self.assertEqual(created.status_code, 200)
            matter_id = created.get_json()["matter"]["matter_id"]

            material = client.post(
                f"/api/cases/{matter_id}/materials",
                json={"title": "证据材料", "text": "合同原件显示被告欠款。"},
            )
            self.assertEqual(material.status_code, 200)

            plan = client.post(f"/api/cases/{matter_id}/tasks/plan", json={"task": "生成代理意见"})
            self.assertEqual(plan.status_code, 200)
            self.assertIn("long_document_plan", plan.get_json())

            pred = client.post(
                "/api/court-ai/predict",
                json={"facts": "合同原件和银行流水齐备。", "claims": "请求付款。"},
            )
            self.assertEqual(pred.status_code, 200)
            self.assertEqual(len(pred.get_json()["predictions"]), len(CourtAIPredictor.NODES))


if __name__ == "__main__":
    unittest.main()
