from __future__ import annotations

from pathlib import Path
from tempfile import NamedTemporaryFile

from flask import Blueprint, jsonify, request

from .core import CaseAIOrchestrator, CaseStore, CourtAIPredictor


def create_case_blueprint(
    store_root: str | Path | None = None,
    knowledge_roots: list[str | Path] | None = None,
) -> Blueprint:
    store = CaseStore(store_root)
    orchestrator = CaseAIOrchestrator(store, knowledge_roots=knowledge_roots)
    bp = Blueprint("case_system", __name__, url_prefix="/api/cases")

    @bp.get("/capabilities")
    def capabilities():
        return jsonify(orchestrator.capabilities())

    @bp.get("")
    def list_cases():
        return jsonify({"items": store.list_matters()})

    @bp.post("/knowledge/global/sync")
    def sync_global_knowledge():
        payload = request.get_json(silent=True) or {}
        return jsonify(
            orchestrator.knowledge.sync_global_sources(
                roots=payload.get("roots"),
                max_files=int(payload.get("max_files", 800)),
                force=bool(payload.get("force", False)),
            )
        )

    @bp.get("/knowledge/global/search")
    def search_global_knowledge():
        return jsonify(
            {
                "items": orchestrator.knowledge.search_global(
                    request.args.get("q", ""),
                    top_k=int(request.args.get("top_k", 8)),
                    include_inactive=request.args.get("include_inactive") == "1",
                    auto_sync=request.args.get("auto_sync", "1") != "0",
                ),
                "records": store.list_global_knowledge(),
            }
        )

    @bp.post("")
    def create_case():
        payload = request.get_json(silent=True) or {}
        matter = store.create_matter(
            name=payload.get("name", ""),
            team_id=payload.get("team_id", "default"),
            source_channel=payload.get("source_channel", "local"),
            metadata=payload.get("metadata") or {},
        )
        return jsonify({"matter": matter.__dict__})

    @bp.get("/<matter_id>")
    def get_case(matter_id: str):
        matter = store.get_matter(matter_id)
        return jsonify(
            {
                "matter": matter.__dict__,
                "materials": store.list_materials(matter_id),
                "knowledge": store.list_knowledge(matter_id),
            }
        )

    @bp.post("/<matter_id>/materials")
    def add_material(matter_id: str):
        tags = _split_tags(request.form.get("tags", ""))
        title = request.form.get("title", "")
        document_type = request.form.get("document_type", "material")
        if request.is_json:
            payload = request.get_json() or {}
            record = orchestrator.materials.add_material(
                matter_id=matter_id,
                text=payload.get("text", ""),
                title=payload.get("title", title),
                tags=payload.get("tags", tags),
                document_type=payload.get("document_type", document_type),
                metadata=payload.get("metadata") or {},
            )
            return jsonify({"material": record})
        uploaded = request.files.get("file")
        if not uploaded or not uploaded.filename:
            return jsonify({"error": "请上传文件或提交 JSON text"}), 400
        with NamedTemporaryFile(delete=False, suffix=Path(uploaded.filename).suffix) as tmp:
            uploaded.save(tmp.name)
            tmp_path = Path(tmp.name)
        try:
            record = orchestrator.materials.add_material(
                matter_id=matter_id,
                file_path=tmp_path,
                title=title or Path(uploaded.filename).stem,
                tags=tags,
                document_type=document_type,
                metadata={"original_filename": uploaded.filename},
            )
        finally:
            tmp_path.unlink(missing_ok=True)
        return jsonify({"material": record})

    @bp.get("/<matter_id>/materials")
    def list_materials(matter_id: str):
        return jsonify(
            {
                "items": store.list_materials(matter_id),
                "latest": orchestrator.materials.latest_materials(matter_id),
            }
        )

    @bp.post("/<matter_id>/knowledge")
    def add_knowledge(matter_id: str):
        if request.is_json:
            payload = request.get_json() or {}
            record = orchestrator.knowledge.add_knowledge(
                matter_id=matter_id,
                title=payload.get("title", ""),
                text=payload.get("text", ""),
                source=payload.get("source", "manual"),
                source_type=payload.get("source_type", "team_experience"),
                tags=payload.get("tags"),
                validity_status=payload.get("validity_status"),
                effective_from=payload.get("effective_from"),
                effective_until=payload.get("effective_until"),
                metadata=payload.get("metadata") or {},
            )
            return jsonify({"knowledge": record})
        uploaded = request.files.get("file")
        if not uploaded or not uploaded.filename:
            return jsonify({"error": "请上传文件或提交 JSON text"}), 400
        with NamedTemporaryFile(delete=False, suffix=Path(uploaded.filename).suffix) as tmp:
            uploaded.save(tmp.name)
            tmp_path = Path(tmp.name)
        try:
            record = orchestrator.knowledge.import_file(
                matter_id=matter_id,
                file_path=tmp_path,
                title=request.form.get("title") or Path(uploaded.filename).stem,
                source_type=request.form.get("source_type", "team_experience"),
                tags=_split_tags(request.form.get("tags", "")),
                metadata={"original_filename": uploaded.filename},
            )
        finally:
            tmp_path.unlink(missing_ok=True)
        return jsonify({"knowledge": record})

    @bp.get("/<matter_id>/knowledge/search")
    def search_knowledge(matter_id: str):
        return jsonify(
            {
                "items": orchestrator.knowledge.search(
                    matter_id,
                    request.args.get("q", ""),
                    top_k=int(request.args.get("top_k", 8)),
                    include_inactive=request.args.get("include_inactive") == "1",
                )
            }
        )

    @bp.get("/<matter_id>/agent-sources")
    def agent_sources(matter_id: str):
        return jsonify(
            orchestrator.knowledge.agent_sources_for_task(
                matter_id,
                request.args.get("q", ""),
                top_k=int(request.args.get("top_k", 12)),
            )
        )

    @bp.post("/<matter_id>/feedback")
    def add_feedback(matter_id: str):
        payload = request.get_json(silent=True) or {}
        rule = orchestrator.memory.add_rule(
            matter_id,
            feedback=payload.get("feedback", ""),
            scope=payload.get("scope", "matter"),
            author=payload.get("author", ""),
        )
        return jsonify({"rule": rule})

    @bp.post("/<matter_id>/tasks/plan")
    def plan_task(matter_id: str):
        payload = request.get_json(silent=True) or {}
        return jsonify(orchestrator.plan_task(matter_id, payload.get("task", ""), payload.get("target_chars", 20000)))

    @bp.post("/<matter_id>/tasks/prepare-model")
    def prepare_model(matter_id: str):
        payload = request.get_json(silent=True) or {}
        return jsonify(
            orchestrator.prepare_model_payload(
                matter_id,
                payload.get("task", ""),
                policy_name=payload.get("policy_name", "internal_legal_analysis"),
                target_chars=payload.get("target_chars", 20000),
            )
        )

    @bp.post("/<matter_id>/tasks/run-local")
    def run_local(matter_id: str):
        payload = request.get_json(silent=True) or {}
        return jsonify(orchestrator.run_local_task(matter_id, payload.get("task", ""), payload.get("target_chars", 20000)))

    @bp.post("/<matter_id>/restore")
    def restore(matter_id: str):
        store.get_matter(matter_id)
        payload = request.get_json(silent=True) or {}
        return jsonify(orchestrator.restore_model_output(payload.get("mapping_path", ""), payload.get("text", "")))

    @bp.post("/<matter_id>/verify-sources")
    def verify_sources(matter_id: str):
        payload = request.get_json(silent=True) or {}
        return jsonify(orchestrator.verifier.verify(matter_id, payload.get("claims", [])))

    return bp


def create_court_ai_blueprint() -> Blueprint:
    predictor = CourtAIPredictor()
    bp = Blueprint("court_ai", __name__, url_prefix="/api/court-ai")

    @bp.post("/predict")
    def predict():
        payload = request.get_json(silent=True) or {}
        return jsonify(
            predictor.predict(
                facts=payload.get("facts", ""),
                claims=payload.get("claims", ""),
                evidence=payload.get("evidence") or [],
            )
        )

    return bp


def _split_tags(value: str) -> list[str]:
    return [item.strip() for item in (value or "").replace("，", ",").split(",") if item.strip()]
