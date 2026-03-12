import { useMemo, useState } from 'react'

const REQUIRED_COOKIE_KEYS = ['wr_skey']
const RECOMMENDED_COOKIE_KEYS = ['wr_vid', 'wr_name', 'wr_gid', 'sessid', 'uin']

const parseCookieString = input => {
  const text = String(input || '').trim()
  if (!text) return []

  return text
    .split(';')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const separatorIndex = item.indexOf('=')
      if (separatorIndex <= 0) {
        return {
          raw: item,
          key: '',
          value: '',
          valid: false
        }
      }

      const key = item.slice(0, separatorIndex).trim()
      const value = item.slice(separatorIndex + 1).trim()
      return {
        raw: item,
        key,
        value,
        valid: Boolean(key)
      }
    })
}

const maskValue = value => {
  const text = String(value || '')
  if (text.length <= 8) return text ? `${text.slice(0, 2)}***${text.slice(-1)}` : ''
  return `${text.slice(0, 4)}***${text.slice(-4)}`
}

export default function WeReadCookieToolPage() {
  const [rawCookie, setRawCookie] = useState('')
  const [xWrpa0, setXWrpa0] = useState('')
  const [copied, setCopied] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const analysis = useMemo(() => {
    const entries = parseCookieString(rawCookie)
    const validEntries = entries.filter(item => item.valid)
    const invalidEntries = entries.filter(item => !item.valid && item.raw)
    const cookieMap = validEntries.reduce((acc, item) => {
      if (!acc[item.key]) acc[item.key] = item.value
      return acc
    }, {})

    const missingRequired = REQUIRED_COOKIE_KEYS.filter(key => !cookieMap[key])
    const missingRecommended = RECOMMENDED_COOKIE_KEYS.filter(key => !cookieMap[key])
    const normalizedCookie = validEntries.map(item => `${item.key}=${item.value}`).join('; ')

    return {
      totalCount: validEntries.length,
      invalidEntries,
      cookieMap,
      missingRequired,
      missingRecommended,
      normalizedCookie,
      isUsable: Boolean(validEntries.length) && missingRequired.length === 0
    }
  }, [rawCookie])

  const testDiagnostics = testResult?.payload?.diagnostics || null

  const handleCopy = async () => {
    if (!analysis.normalizedCookie || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return
    await navigator.clipboard.writeText(analysis.normalizedCookie)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const handleTest = async () => {
    if (!analysis.normalizedCookie) return
    try {
      setTesting(true)
      setTestResult(null)
      const response = await fetch('/api/tools/weread-cookie-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie: analysis.normalizedCookie, xWrpa0 })
      })
      const payload = await response.json().catch(() => null)
      setTestResult({ ok: response.ok, payload })
    } catch (error) {
      setTestResult({ ok: false, payload: { error: error?.message || '测试请求失败' } })
    } finally {
      setTesting(false)
    }
  }

  return (
    <main className='mx-auto max-w-5xl px-5 py-10 md:px-6'>
      <section className='heo-card overflow-hidden'>
        <div className='heo-card__body space-y-8'>
          <div className='space-y-3'>
            <div className='text-sm text-gray-500'>微信读书工具</div>
            <h1 className='text-3xl font-bold text-gray-900'>WeRead Cookie / x-wrpa-0 校验</h1>
            <p className='text-sm leading-7 text-gray-600'>
              打开 <code>https://weread.qq.com/</code> 登录后，按 <code>F12</code>，在 <code>Network</code> 里选任意一个
              <code>weread.qq.com</code> 请求，把请求头里的整串 <code>cookie</code> 复制到下面。<code>x-wrpa-0</code>
              不是所有接口都绝对必需，但对部分 <code>web</code> 接口更稳，建议一并填写。
            </p>
          </div>

          <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
            <div className='space-y-4'>
              <label className='block space-y-2'>
                <span className='text-sm font-medium text-gray-700'>原始 Cookie</span>
                <textarea
                  value={rawCookie}
                  onChange={event => setRawCookie(event.target.value)}
                  placeholder='例如：wr_vid=...; wr_name=...; wr_skey=...'
                  className='min-h-[260px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                />
              </label>

              <label className='block space-y-2'>
                <span className='text-sm font-medium text-gray-700'>x-wrpa-0（建议填写）</span>
                <input
                  value={xWrpa0}
                  onChange={event => setXWrpa0(event.target.value)}
                  placeholder='从同一个请求头里复制 x-wrpa-0 的值'
                  className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                />
              </label>

              <div className='flex flex-wrap gap-3'>
                <button
                  type='button'
                  onClick={handleCopy}
                  disabled={!analysis.normalizedCookie}
                  className='rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300'>
                  {copied ? '已复制' : '复制标准化 Cookie'}
                </button>
                <button
                  type='button'
                  onClick={handleTest}
                  disabled={!analysis.normalizedCookie || testing}
                  className='rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300'>
                  {testing ? '测试中...' : '测试当前凭据'}
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setRawCookie('')
                    setXWrpa0('')
                    setTestResult(null)
                  }}
                  className='rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50'>
                  清空
                </button>
              </div>

              {testResult ? (
                <div className={`rounded-2xl border p-4 text-sm leading-7 ${testResult.ok ? 'border-green-200 bg-green-50 text-green-900' : 'border-rose-200 bg-rose-50 text-rose-900'}`}>
                  <div className='font-medium'>{testResult.ok ? '测试通过' : '测试失败'}</div>
                  <div className='mt-2 whitespace-pre-wrap break-all'>
                    {testResult.ok
                      ? `模式：${testDiagnostics?.upstreamMode || ''}\n状态：${testDiagnostics?.upstreamStatus || ''}\n书架分组：${testDiagnostics?.archiveCount || 0}\n图书数：${testDiagnostics?.bookCount || 0}\n听书数：${testDiagnostics?.lectureBookCount || 0}\nwr_vid：${testDiagnostics?.wrVid || '未识别'}\n已带 x-wrpa-0：${testDiagnostics?.hasXWrpa0 ? '是' : '否'}`
                      : `${testResult.payload?.error || '请求失败'}${testDiagnostics ? `\n${JSON.stringify(testDiagnostics, null, 2)}` : ''}`}
                  </div>
                </div>
              ) : null}
            </div>

            <div className='space-y-4'>
              <div className='rounded-2xl border border-gray-200 bg-gray-50 p-5'>
                <div className='text-sm font-medium text-gray-700'>可用性</div>
                <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium ${analysis.isUsable ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {analysis.isUsable ? '当前格式可用' : '当前还不能直接使用'}
                </div>
                <div className='mt-4 space-y-2 text-sm text-gray-600'>
                  <div>解析到有效字段：{analysis.totalCount} 个</div>
                  <div>必需字段：{REQUIRED_COOKIE_KEYS.join('、')}</div>
                  <div>建议字段：{RECOMMENDED_COOKIE_KEYS.join('、')}</div>
                  <div>x-wrpa-0：{xWrpa0 ? '已填写' : '未填写'}</div>
                </div>
              </div>

              <div className='rounded-2xl border border-gray-200 bg-white p-5'>
                <div className='text-sm font-medium text-gray-700'>缺失检查</div>
                <div className='mt-3 space-y-3 text-sm text-gray-600'>
                  <div>
                    <div className='font-medium text-gray-800'>缺少必需字段</div>
                    <div className='mt-1'>
                      {analysis.missingRequired.length ? analysis.missingRequired.join('、') : '无'}
                    </div>
                  </div>
                  <div>
                    <div className='font-medium text-gray-800'>缺少建议字段</div>
                    <div className='mt-1'>
                      {analysis.missingRecommended.length ? analysis.missingRecommended.join('、') : '无'}
                    </div>
                  </div>
                  <div>
                    <div className='font-medium text-gray-800'>异常片段</div>
                    <div className='mt-1 break-all'>
                      {analysis.invalidEntries.length ? analysis.invalidEntries.map(item => item.raw).join(' ｜ ') : '无'}
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-2xl border border-gray-200 bg-white p-5'>
                <div className='text-sm font-medium text-gray-700'>已识别字段</div>
                <div className='mt-3 max-h-[260px] space-y-2 overflow-auto text-sm text-gray-600'>
                  {Object.keys(analysis.cookieMap).length ? Object.entries(analysis.cookieMap).map(([key, value]) => (
                    <div key={key} className='flex items-start justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2'>
                      <span className='font-mono text-gray-800'>{key}</span>
                      <span className='break-all text-right'>{maskValue(value)}</span>
                    </div>
                  )) : <div>还没有识别到有效 Cookie。</div>}
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-5 text-sm leading-7 text-blue-900'>
            <div className='font-medium'>如何获取</div>
            <ol className='mt-2 list-decimal space-y-1 pl-5'>
              <li>打开微信读书网页版并保持登录。</li>
              <li>按 <code>F12</code> 打开开发者工具，切到 <code>Network</code>。</li>
              <li>刷新页面，点任意一个 <code>weread.qq.com</code> 请求。</li>
              <li>在 <code>Request Headers</code> 里复制整串 <code>cookie</code>。</li>
              <li>同一个区域里如果有 <code>x-wrpa-0</code>，也顺手复制出来。</li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  )
}

