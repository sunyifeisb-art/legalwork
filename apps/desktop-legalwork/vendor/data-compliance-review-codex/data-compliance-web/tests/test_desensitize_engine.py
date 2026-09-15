from __future__ import annotations

import sys
import re
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

from docx import Document
from openpyxl import Workbook


WEB_ROOT = Path(__file__).resolve().parents[1]
if str(WEB_ROOT) not in sys.path:
    sys.path.insert(0, str(WEB_ROOT))

from desensitize_engine import (  # noqa: E402
    Desensitizer,
    SubjectMapping,
    _agent_subject_replacement_plan,
    _normalize_pdf_character_spacing,
    _validate_output_artifact,
    _valid_agent_replacements,
    process_desensitization,
    sanitize_text_and_subjects,
)
from scripts.preprocess_input import read_table_text  # noqa: E402


class DesensitizeEngineTests(unittest.TestCase):
    def test_legacy_doc_is_rebuilt_as_real_docx_instead_of_renamed_binary(self) -> None:
        source_text = '委托诉讼代理人：张三，北京示例律师事务所律师。联系电话：13800138000。'
        with tempfile.TemporaryDirectory() as temp_name:
            root = Path(temp_name)
            source = root / 'legacy.doc'
            source.write_bytes(b'\xd0\xcf\x11\xe0' + b'\x00' * 256)
            with patch('desensitize_engine.read_text', return_value=source_text), patch(
                'desensitize_engine._agent_is_configured', return_value=False
            ):
                result = process_desensitization(
                    task_id='legacy-doc-regression',
                    input_path=source,
                    document_name='legacy',
                    work_dir=root / 'output',
                    output_format='docx',
                    redaction_mode='standard',
                )

            output = Path(result['output_file'])
            self.assertTrue(zipfile.is_zipfile(output))
            text = '\n'.join(paragraph.text for paragraph in Document(str(output)).paragraphs)
            self.assertNotIn('张三', text)
            self.assertNotIn('13800138000', text)
            self.assertIn('张某', text)

    def test_output_validation_rejects_binary_content_renamed_to_docx(self) -> None:
        with tempfile.TemporaryDirectory() as temp_name:
            output = Path(temp_name) / 'fake.docx'
            output.write_bytes(b'\xd0\xcf\x11\xe0' + b'\x00' * 128)
            with self.assertRaisesRegex(RuntimeError, 'DOCX'):
                _validate_output_artifact(output, 'docx')

    def test_docx_headers_and_footers_are_included_in_local_redaction(self) -> None:
        with tempfile.TemporaryDirectory() as temp_name:
            root = Path(temp_name)
            source = root / 'stories.docx'
            document = Document()
            document.add_paragraph('正文不含个人信息。')
            document.sections[0].header.paragraphs[0].text = '委托诉讼代理人：张三，律师。'
            document.sections[0].footer.paragraphs[0].text = '联系电话：13800138000。'
            document.save(str(source))

            with patch('desensitize_engine._agent_is_configured', return_value=False):
                result = process_desensitization(
                    task_id='docx-story-regression',
                    input_path=source,
                    document_name='stories',
                    work_dir=root / 'output',
                    output_format='docx',
                    redaction_mode='standard',
                )

            output = Document(str(result['output_file']))
            header = output.sections[0].header.paragraphs[0].text
            footer = output.sections[0].footer.paragraphs[0].text
            self.assertNotIn('张三', header)
            self.assertIn('张某', header)
            self.assertNotIn('13800138000', footer)

    def test_single_row_spreadsheet_header_is_not_mistaken_for_an_empty_sheet(self) -> None:
        with tempfile.TemporaryDirectory() as temp_name:
            source = Path(temp_name) / 'single-row.xlsx'
            workbook = Workbook()
            workbook.active['A1'] = '联系电话：13800138000'
            workbook.save(source)
            extracted = read_table_text(source)
            self.assertIn('13800138000', extracted)
            self.assertNotIn('（空表）', extracted)

    def test_pdf_character_spacing_and_legal_subjects_are_normalized(self) -> None:
        source = (
            '上 诉 人 ： 河 南 联 洋 建 筑 工 程 有 限 公 司 ， 住 所 地 河 南 省 林 州 市 红 旗 渠 路 27号。\n'
            '法 定 代 表 人 ： 张 浩。\n'
            '委 托 诉 讼 代 理 人 ： 兰 芳 ， 内 蒙 古 誉 昊 律 师 事 务 所 律 师。\n'
            '上 诉 人 河 南 联 洋 建 筑 工 程 有 限 公 司 （ 简 称 联 洋 公 司 ）。'
        )
        normalized = _normalize_pdf_character_spacing(source)
        redacted, findings, mappings = sanitize_text_and_subjects(normalized, Desensitizer())

        self.assertNotIn('河南联洋建筑工程有限公司', redacted)
        self.assertNotIn('联洋公司', redacted)
        self.assertNotIn('张浩', redacted)
        self.assertNotIn('兰芳', redacted)
        self.assertNotIn('内蒙古誉昊律师事务所', redacted)
        self.assertIn('某洋公司', redacted)
        self.assertIn('张某', redacted)
        self.assertIn('兰某', redacted)
        self.assertIn('某昊律师事务所', redacted)
        self.assertIn('住所地：某地址', redacted)
        self.assertEqual({item.entity_type for item in findings}, {'ADDRESS'})
        self.assertIn(('联洋公司', '某洋公司'), {(item.original, item.redacted) for item in mappings})

    def test_distinct_subjects_never_share_a_token(self) -> None:
        source = (
            '原告：张三，男。被告：张强，男。'
            '甲方：小米科技有限公司。乙方：红米科技有限公司。'
            '张三与张强签约。'
        )
        redacted, _, mappings = sanitize_text_and_subjects(source, Desensitizer())
        mapping = {item.original: item.redacted for item in mappings}

        self.assertEqual(mapping['张三'], '张某甲')
        self.assertEqual(mapping['张强'], '张某乙')
        self.assertEqual(mapping['小米科技有限公司'], '某米甲公司')
        self.assertEqual(mapping['红米科技有限公司'], '某米乙公司')
        self.assertNotEqual(mapping['张三'], mapping['张强'])
        self.assertNotEqual(mapping['小米科技有限公司'], mapping['红米科技有限公司'])
        self.assertEqual(redacted.count('张某甲'), 2)
        self.assertEqual(redacted.count('张某乙'), 2)

    def test_address_rule_does_not_redact_generic_legal_phrases(self) -> None:
        source = '当事人应申报经常居住地及财产情况，并按送达地址送达相关法律文书。'
        redacted, findings, _ = sanitize_text_and_subjects(source, Desensitizer())
        self.assertEqual(redacted, source)
        self.assertEqual(findings, [])

    def test_role_words_inside_prose_do_not_consume_following_verbs_as_a_name(self) -> None:
        source = '内部联系人使用花名阿北，后文再次称阿北负责交接。'
        redacted, _, mappings = sanitize_text_and_subjects(source, Desensitizer())
        self.assertIn('联系人使用花名', redacted)
        self.assertNotIn('使用花名', {item.original for item in mappings})
        self.assertNotIn('阿北', redacted)
        self.assertEqual(redacted.count('阿某'), 2)

    def test_agent_entity_types_use_program_replacement_policy(self) -> None:
        source = '杨俊生与小米科技有限公司签订合同。'
        replacements = _valid_agent_replacements({
            'replacements': [
                {'original': '杨俊生', 'replacement': '某某某', 'entity_type': '姓名'},
                {'original': '小米科技有限公司', 'replacement': '某公司', 'entity_type': '公司'},
            ]
        }, source)
        self.assertEqual(replacements[0]['replacement'], '杨某某')
        self.assertEqual(replacements[0]['entity_type'], 'PERSON')
        self.assertEqual(replacements[1]['replacement'], '某米公司')
        self.assertEqual(replacements[1]['entity_type'], 'ORGANIZATION')

    def test_agent_discovered_subject_does_not_reuse_existing_token(self) -> None:
        items = [
            {'original': '张强', 'replacement': '张某', 'entity_type': 'PERSON'},
            {'original': '河南联洋建筑工程有限公司', 'replacement': '某洋公司', 'entity_type': 'ORGANIZATION'},
            {'original': '联洋公司', 'replacement': '某洋公司', 'entity_type': 'ORGANIZATION'},
        ]
        current_text = '既有主体张某。遗漏主体张强。河南联洋建筑工程有限公司（简称联洋公司）。'
        plan = _agent_subject_replacement_plan(items, current_text)
        self.assertNotEqual(plan['张强'], '张某')
        self.assertEqual(plan['河南联洋建筑工程有限公司'], plan['联洋公司'])

    def test_limited_enhancement_reuses_the_existing_subject_ledger(self) -> None:
        items = [
            {'original': '中国信达山东分公司', 'replacement': '某达公司', 'entity_type': 'ORGANIZATION'},
        ]
        existing = [SubjectMapping(
            entity_type='company_name',
            original='中国信达资产管理股份有限公司山东省分公司',
            redacted='某达公司',
            location='全文',
            confidence=0.98,
        )]
        plan = _agent_subject_replacement_plan(
            items,
            '既有主体某达公司，遗漏简称中国信达山东分公司。',
            existing,
        )
        self.assertEqual(plan['中国信达山东分公司'], '某达公司')

    def test_standard_mode_builds_one_consistent_ledger_for_complex_case_parties(self) -> None:
        source = (
            '上诉人（原审被告）：中国信达资产管理股份有限公司山东省分公司，住所地：山东省济南市某路1号。\n'
            '上诉人（原审被告）：国家税务总局上饶市信州区税务局，住所地：江西省上饶市某路2号。\n'
            '被上诉人（原审原告）：南昌红谷滩金控资产管理集团有限公司，住所地：江西省南昌市某路3号。\n'
            '原审第三人：江西立天唐人房地产发展有限公司，住所地：江西省某地。\n'
            '原审第三人：上海立天唐人投资集团有限公司，住所地：上海市某地。\n'
            '原审第三人：章丘立天唐人置业有限公司，住所地：山东省某地。\n'
            '上诉人中国信达资产管理股份有限公司山东省分公司（以下简称中国信达山东分公司）、'
            '上诉人国家税务总局上饶市信州区税务局（以下简称信州区税务局）因与被上诉人'
            '南昌红谷滩金控资产管理集团有限公司（以下简称南昌红谷滩公司）执行分配方案异议之诉一案。\n'
            '中国信达山东分公司认为南昌红谷滩公司无权优先受偿。'
            '江西立天唐人公司、上海立天唐人公司、章丘立天唐人公司分别承担责任。'
        )

        redacted, _, mappings = sanitize_text_and_subjects(source, Desensitizer())
        mapping = {item.original.strip(): item.redacted for item in mappings}

        originals = (
            '中国信达资产管理股份有限公司山东省分公司', '中国信达山东分公司',
            '国家税务总局上饶市信州区税务局', '信州区税务局',
            '南昌红谷滩金控资产管理集团有限公司', '南昌红谷滩公司',
            '江西立天唐人房地产发展有限公司', '江西立天唐人公司',
            '上海立天唐人投资集团有限公司', '上海立天唐人公司',
            '章丘立天唐人置业有限公司', '章丘立天唐人公司',
        )
        for original in originals:
            self.assertNotIn(original, redacted)

        self.assertEqual(mapping['中国信达资产管理股份有限公司山东省分公司'], mapping['中国信达山东分公司'])
        self.assertEqual(mapping['国家税务总局上饶市信州区税务局'], mapping['信州区税务局'])
        self.assertEqual(mapping['南昌红谷滩金控资产管理集团有限公司'], mapping['南昌红谷滩公司'])
        related_tokens = {
            mapping['江西立天唐人房地产发展有限公司'],
            mapping['上海立天唐人投资集团有限公司'],
            mapping['章丘立天唐人置业有限公司'],
        }
        self.assertEqual(len(related_tokens), 3)
        self.assertIn('因与被上诉人', redacted)
        self.assertIn('认为', redacted)
        self.assertNotIn('某务局）因与被上诉人', redacted)

    def test_org_detection_never_absorbs_surrounding_legal_prose(self) -> None:
        source = (
            '除去其持有的上饶银行股份有限公司股权外还有大量财产可供执行。'
            '一审法院依法扣划在江西省产交所股权登记结算有限公司的孳息。'
            '被执行人为企业法人，经营过程中存在未缴的企业所得税。'
            '根据《中华人民共和国企业破产法》的规定，最高人民法院相关解释继续适用。'
        )
        redacted, _, mappings = sanitize_text_and_subjects(source, Desensitizer())
        mapping_originals = {item.original.strip() for item in mappings}

        self.assertIn('除去其持有的', redacted)
        self.assertIn('股权外还有大量财产可供执行', redacted)
        self.assertIn('一审法院依法扣划在', redacted)
        self.assertIn('的孳息', redacted)
        self.assertIn('被执行人为企业法人，经营过程中存在未缴的企业所得税', redacted)
        self.assertIn('最高人民法院', redacted)
        self.assertEqual(
            mapping_originals,
            {'上饶银行股份有限公司', '江西省产交所股权登记结算有限公司'},
        )

    def test_org_detection_trims_applicant_and_payment_prose(self) -> None:
        source = (
            '关于申请人远东福斯特新能源有限公司与被申请人某汽车公司的纠纷，'
            '应在补助资金分配上依法保护申请人远东福斯特新能源有限公司。'
            '之后由财政部将补贴资金转发至公司所在地的省财政厅。'
        )
        redacted, _, mappings = sanitize_text_and_subjects(source, Desensitizer())
        originals = {item.original for item in mappings}
        self.assertIn('远东福斯特新能源有限公司', originals)
        self.assertNotIn('关于申请人远东福斯特新能源有限公司', originals)
        self.assertNotIn('并在补助资金分配上依法保护申请人远东福斯特新能源有限公司', originals)
        self.assertFalse(any('转发至公司' in original for original in originals))
        self.assertIn('关于申请人', redacted)
        self.assertIn('之后由财政部将补贴资金转发至公司所在地', redacted)

    def test_decoratively_spaced_judicial_roles_still_redact_each_name(self) -> None:
        source = '审 判 长 陈东强 审 判 员 马丽 法 官 助 理 刘小玉 书 记 员 马抒祺'
        redacted, _, mappings = sanitize_text_and_subjects(source, Desensitizer())
        mapping = {item.original.strip(): item.redacted for item in mappings}

        self.assertEqual(mapping['陈东强'], '陈某某')
        self.assertEqual(mapping['马丽'], '马某')
        self.assertEqual(mapping['刘小玉'], '刘某某')
        self.assertEqual(mapping['马抒祺'], '马某某')
        for original in mapping:
            self.assertNotIn(original, redacted)

    def test_judicial_names_at_line_end_and_name_lists_are_redacted(self) -> None:
        source = (
            '审理法官： 仲伟珩 孙建国 林莹\n'
            '审 判 员 林 莹\n'
            '书 记 员 常 跃\n'
        )
        redacted, _, mappings = sanitize_text_and_subjects(source, Desensitizer())
        mapping = {re.sub(r'\s+', '', item.original): item.redacted for item in mappings}
        for name in ('仲伟珩', '孙建国', '林莹', '常跃'):
            self.assertIn(name, mapping)
            self.assertNotIn(name, re.sub(r'\s+', '', redacted))


if __name__ == '__main__':
    unittest.main()
