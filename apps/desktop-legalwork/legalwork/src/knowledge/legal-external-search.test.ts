import { afterEach, describe, expect, it, vi } from 'vitest'
import { plainTextToDocxBuffer } from '../adapters/tool/plain-text-docx.js'
import { legalExternalSearch } from './legal-external-search.js'

const jsonResponse = (data: unknown): Response => ({
  ok: true,
  status: 200,
  json: async () => data
}) as Response

const bufferResponse = (data: Buffer): Response => ({
  ok: true,
  status: 200,
  arrayBuffer: async () => data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
}) as Response

describe('legalExternalSearch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prioritizes the NPC database for statute and article retrieval guidance', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ rows: [] }))

    const result = await legalExternalSearch('劳动合同法 第三十八条')

    expect(result.summary).toContain('默认官方法规来源：国家法律法规数据库')
    expect(result.summary).toContain('https://flk.npc.gov.cn')
    expect(result.summary).toContain('未指定北大法宝、元典 MCP 或其他商业库')
    expect(result.summary).toContain('建议 web_search 查询：site:flk.npc.gov.cn 劳动合同法 第三十八条')
  })

  it('returns deduplicated and ranked NPC records with detail metadata', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      if (url.includes('/flfgDetails')) {
        return jsonResponse({
          code: 200,
          data: {
            bbbs: 'law-1',
            title: '中华人民共和国劳动合同法',
            flxz: '法律',
            zdjgName: '全国人民代表大会常务委员会',
            gbrq: '2012-12-28',
            sxrq: '2013-07-01',
            sxx: 3,
            content: {
              title: '中华人民共和国劳动合同法',
              children: [
                {
                  title: '第四章 劳动合同的解除和终止',
                  children: [{ title: '第三十八条', children: [] }]
                }
              ]
            }
          }
        })
      }
      return jsonResponse({
        rows: [
          {
            bbbs: 'law-1',
            title: '<em>中华人民共和国劳动合同法</em>',
            flxz: '法律',
            zdjgName: '全国人民代表大会常务委员会',
            gbrq: '2012-12-28',
            sxrq: '2013-07-01',
            sxx: 3,
            score: 98
          },
          {
            bbbs: 'law-1',
            title: '<em>中华人民共和国劳动合同法</em>',
            flxz: '法律',
            zdjgName: '全国人民代表大会常务委员会',
            gbrq: '2012-12-28',
            sxrq: '2013-07-01',
            sxx: 3,
            score: 98
          }
        ]
      })
    })

    const result = await legalExternalSearch('《中华人民共和国劳动合同法》第三十八条')

    expect(result.records).toHaveLength(1)
    expect(result.records[0]?.title).toBe('中华人民共和国劳动合同法')
    expect(result.records[0]?.sourceKind).toBe('web')
    expect(result.records[0]?.excerpt).toContain('现行有效')
    expect(result.records[0]?.excerpt).toContain('目录命中：第三十八条')
    expect(result.summary).toContain('标题精确 + 标题模糊 + 正文模糊')
    expect(fetchMock).toHaveBeenCalled()
  })

  it('downloads official DOCX and extracts the requested article text', async () => {
    const docx = plainTextToDocxBuffer([
      '中华人民共和国劳动合同法',
      '第一条 为了完善劳动合同制度，明确劳动合同双方当事人的权利和义务。',
      '第三十八条 用人单位有下列情形之一的，劳动者可以解除劳动合同：',
      '（一）未按照劳动合同约定提供劳动保护或者劳动条件的；',
      '（二）未及时足额支付劳动报酬的。'
    ].join('\n'))

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      if (url.includes('/flfgDetails')) {
        return jsonResponse({
          code: 200,
          data: {
            bbbs: 'law-1',
            title: '中华人民共和国劳动合同法',
            flxz: '法律',
            zdjgName: '全国人民代表大会常务委员会',
            gbrq: '2012-12-28',
            sxrq: '2013-07-01',
            sxx: 3,
            content: {
              title: '中华人民共和国劳动合同法',
              children: [{ title: '第三十八条', children: [] }]
            }
          }
        })
      }
      if (url.includes('/download/pc')) {
        return jsonResponse({ code: 200, data: { url: 'https://signed.example/law.docx' } })
      }
      if (url === 'https://signed.example/law.docx') {
        return bufferResponse(docx)
      }
      return jsonResponse({
        rows: [
          {
            bbbs: 'law-1',
            title: '中华人民共和国劳动合同法',
            flxz: '法律',
            zdjgName: '全国人民代表大会常务委员会',
            gbrq: '2012-12-28',
            sxrq: '2013-07-01',
            sxx: 3,
            score: 98
          }
        ]
      })
    })

    const result = await legalExternalSearch('劳动合同法 第三十八条')

    expect(result.records[0]?.excerpt).toContain('条文原文(按条号抽取)')
    expect(result.records[0]?.excerpt).toContain('劳动者可以解除劳动合同')
    expect(result.records[0]?.excerpt).toContain('未及时足额支付劳动报酬')
  })
})
