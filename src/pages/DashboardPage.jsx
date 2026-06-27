import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function DashboardPage() {
  const [baseUrl, setBaseUrl] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const [activeMethod, setActiveMethod] = useState('GET')
  const [activeTab, setActiveTab] = useState('HEADERS')
  const [headersText, setHeadersText] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [tokenA, setTokenA] = useState('')
  const [tokenB, setTokenB] = useState('')
  const [scanning, setScanning] = useState(false)
  const [terminalLines, setTerminalLines] = useState([
    { text: '[*] RestRecon v1.0 — Ready', cls: 'info' },
    { text: '[*] Configure target and hit INITIALIZE SCAN', cls: 'info' },
  ])
  const navigate = useNavigate()
  const terminalRef = useRef(null)

  const colors = {
    info: '#555580',
    cmd: '#00D4FF',
    safe: '#00FF41',
    warn: '#FFB800',
    vuln: '#FF3E3E',
  }

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  // Parse "Key: Value\nKey2: Value2" → { Key: "Value", Key2: "Value2" }
  function parseHeaders(text) {
    const headers = {}
    if (!text.trim()) return headers
    text.split('\n').forEach(line => {
      const idx = line.indexOf(':')
      if (idx > 0) {
        const key = line.substring(0, idx).trim()
        const val = line.substring(idx + 1).trim()
        if (key) headers[key] = val
      }
    })
    return headers
  }

  // Add line to terminal with delay
  function addLine(text, cls, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, { text, cls }])
        resolve()
      }, delay)
    })
  }

  const runScan = async () => {
    if (!baseUrl.trim()) return

    setScanning(true)
    setTerminalLines([])

    const parsedHeaders = parseHeaders(headersText)
    const target = `${baseUrl}${endpoint}`

    // Pre-scan animation
    await addLine('[*] RestRecon v1.0 — Scan Engine', 'info', 100)
    await addLine(`[*] Target: ${target}`, 'info', 300)
    await addLine(`[*] Method: ${activeMethod}`, 'info', 500)
    await addLine('[*] Loading 6 attack modules...', 'info', 700)
    await addLine('', 'info', 900)

    // Module loading animation
    const moduleNames = ['BOLA/IDOR', 'SQL INJECTION', 'BROKEN AUTH', 'SENSITIVE DATA', 'SEC HEADERS', 'RATE LIMITING']
    for (let i = 0; i < moduleNames.length; i++) {
      await addLine(`  [${String(i + 1).padStart(2, '0')}] ${moduleNames[i]} — loaded`, 'cmd', 150)
    }

    await addLine('', 'info', 200)
    await addLine('[*] Sending scan request to backend...', 'info', 300)
    await addLine('', 'info', 100)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: baseUrl.trim(),
          endpoint: endpoint.trim(),
          method: activeMethod,
          headers: parsedHeaders,
          tokenA: tokenA.trim() || null,
          tokenB: tokenB.trim() || null,
        })
      })

      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`)
      }

      const data = await res.json()
      const { score, findings } = data

      // Display each module result in terminal
      const moduleOrder = [
        { key: 'idor', label: 'MODULE 01', name: 'BOLA/IDOR — Dual-token cross-match' },
        { key: 'sqli', label: 'MODULE 02', name: 'SQL INJECTION — Payload fuzzing' },
        { key: 'brokenAuth', label: 'MODULE 03', name: 'BROKEN AUTH — Header stripping' },
        { key: 'sensitiveData', label: 'MODULE 04', name: 'SENSITIVE DATA — Regex pattern scan' },
        { key: 'secHeaders', label: 'MODULE 05', name: 'SECURITY HEADERS — Compliance check' },
        { key: 'rateLimit', label: 'MODULE 06', name: 'RATE LIMITING — Concurrency burst' },
      ]

      for (const mod of moduleOrder) {
        const result = findings[mod.key]
        if (!result) continue

        await addLine(`[${mod.label}] ${mod.name}`, 'cmd', 400)

        // Severity → color class
        let cls = 'safe'
        let prefix = '[+] SAFE'
        if (result.severity === 'CRITICAL') { cls = 'vuln'; prefix = '[!] CRITICAL' }
        else if (result.severity === 'HIGH') { cls = 'vuln'; prefix = '[!] HIGH' }
        else if (result.severity === 'MEDIUM') { cls = 'warn'; prefix = '[WARN] MEDIUM' }
        else if (result.severity === 'SKIPPED') { cls = 'info'; prefix = '[~] SKIPPED' }
        else { prefix = '[+] PASSED' }

        await addLine(`${prefix}: ${result.detail}`, cls, 600)
        await addLine('', 'info', 100)
      }

      // Final summary
      await addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info', 300)

      const vulnCount = Object.values(findings).filter(f => f.vulnerable).length
      const scoreClass = score <= 40 ? 'vuln' : score <= 70 ? 'warn' : 'safe'

      await addLine(`[✓] SCAN COMPLETE — ${vulnCount} vulnerabilit${vulnCount === 1 ? 'y' : 'ies'} found`, vulnCount > 0 ? 'vuln' : 'safe', 300)
      await addLine(`[*] API SECURITY SCORE: ${score}/100 — ${score <= 40 ? 'CRITICAL' : score <= 70 ? 'MODERATE' : 'GOOD'}`, scoreClass, 300)

      // Navigate to report after delay
      setTimeout(() => {
        setScanning(false)
        navigate('/report', {
          state: {
            score,
            findings,
            target,
            method: activeMethod,
          }
        })
      }, 2500)

    } catch (err) {
      await addLine('', 'info', 100)
      await addLine(`[✗] ERROR: ${err.message}`, 'vuln', 200)
      await addLine(`[*] Make sure backend is running on ${import.meta.env.VITE_API_URL}`, 'warn', 300)
      setScanning(false)
    }
  }

  const modules = ['BOLA / IDOR', 'SQL INJECTION', 'BROKEN AUTH', 'SENSITIVE DATA', 'SEC HEADERS', 'RATE LIMITING']
  const methods = ['GET', 'POST', 'PUT', 'DELETE']
  const tabs = ['HEADERS', 'BODY', 'IDOR TOKENS']

  return (
    <div style={{ background: '#0E0C14', minHeight: '100vh', fontFamily: 'monospace' }}>
      <Navbar status={scanning ? 'running' : 'ready'} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 'calc(100vh - 65px)' }}>

        {/* LEFT — Input Panel */}
        <div style={{ padding: '1.5rem', borderRight: '1px solid #1A1A2E', overflowY: 'auto' }}>
          <div style={{ fontSize: '10px', color: '#555566', letterSpacing: '2px', marginBottom: '1rem' }}>TARGET CONFIGURATION</div>

          {/* Base URL */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', color: '#8A8A9A', marginBottom: '6px', letterSpacing: '1px' }}>BASE URL</div>
            <input
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
              placeholder="https://api.target.com"
              style={{ width: '100%', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px' }}
            />
          </div>

          {/* Endpoint */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', color: '#8A8A9A', marginBottom: '6px', letterSpacing: '1px' }}>ENDPOINT</div>
            <input
              value={endpoint}
              onChange={e => setEndpoint(e.target.value)}
              placeholder="/v1/user/1"
              style={{ width: '100%', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px' }}
            />
          </div>

          {/* Method */}
          <div style={{ fontSize: '11px', color: '#8A8A9A', marginBottom: '6px', letterSpacing: '1px' }}>METHOD</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
            {methods.map(m => (
              <button key={m} onClick={() => setActiveMethod(m)} style={{ padding: '7px 14px', fontSize: '11px', fontFamily: 'monospace', border: activeMethod === m ? '1px solid #00FF41' : '1px solid #2A2840', background: activeMethod === m ? 'rgba(0,255,65,0.06)' : '#13111D', color: activeMethod === m ? '#00FF41' : '#555566', cursor: 'pointer', borderRadius: '2px', letterSpacing: '1px' }}>
                {m}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1A1A2E', marginBottom: '1rem' }}>
            {tabs.map(t => (
              <div key={t} onClick={() => setActiveTab(t)} style={{ padding: '7px 16px', fontSize: '11px', color: activeTab === t ? '#00FF41' : '#555566', cursor: 'pointer', letterSpacing: '1px', borderBottom: activeTab === t ? '2px solid #00FF41' : '2px solid transparent' }}>
                {t}
              </div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'IDOR TOKENS' ? (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '11px', color: '#8A8A9A', marginBottom: '6px', letterSpacing: '1px' }}>TOKEN A (YOUR AUTH)</div>
                <input
                  value={tokenA}
                  onChange={e => setTokenA(e.target.value)}
                  placeholder="Bearer eyJhbGci..."
                  style={{ width: '100%', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#8A8A9A', marginBottom: '6px', letterSpacing: '1px' }}>TOKEN B (SECOND USER)</div>
                <input
                  value={tokenB}
                  onChange={e => setTokenB(e.target.value)}
                  placeholder="Bearer eyJhbGci..."
                  style={{ width: '100%', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px' }}
                />
              </div>
            </div>
          ) : activeTab === 'BODY' ? (
            <textarea
              value={bodyText}
              onChange={e => setBodyText(e.target.value)}
              placeholder='{ "key": "value" }'
              style={{ width: '100%', height: '80px', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px', resize: 'none' }}
            />
          ) : (
            <textarea
              value={headersText}
              onChange={e => setHeadersText(e.target.value)}
              placeholder="Authorization: Bearer token..."
              style={{ width: '100%', height: '80px', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px', resize: 'none' }}
            />
          )}

          {/* Attack Modules */}
          <div style={{ fontSize: '10px', color: '#555566', letterSpacing: '2px', margin: '1rem 0 0.75rem' }}>ATTACK MODULES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '1rem' }}>
            {modules.map(mod => (
              <div key={mod} style={{ background: '#13111D', border: '1px solid #2A2840', padding: '8px 10px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF41', flexShrink: 0 }} />
                <span style={{ fontSize: '10px', color: '#8A8A9A', letterSpacing: '0.5px' }}>{mod}</span>
              </div>
            ))}
          </div>

          {/* Scan Button */}
          <button
            onClick={runScan}
            disabled={scanning || !baseUrl.trim()}
            style={{
              width: '100%',
              background: !baseUrl.trim() ? '#1A1A2E' : '#00FF41',
              color: !baseUrl.trim() ? '#555566' : '#0E0C14',
              border: 'none',
              padding: '13px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '2px',
              cursor: scanning || !baseUrl.trim() ? 'not-allowed' : 'pointer',
              borderRadius: '2px',
              fontFamily: 'monospace',
              opacity: scanning ? 0.7 : 1,
            }}
          >
            {scanning ? '⚡ SCANNING...' : '⚡ INITIALIZE SCAN'}
          </button>
        </div>

        {/* RIGHT — Terminal */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '10px', color: '#555566', letterSpacing: '2px', marginBottom: '1rem' }}>LIVE EXECUTION CONSOLE.....⚠ Only test APIs you own or have explicit permission to test.</div>
          <div ref={terminalRef} style={{ background: '#080710', border: '1px solid #1A1A2E', borderRadius: '2px', flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Terminal Header */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', alignItems: 'center' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF3E3E' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFB800' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00FF41' }} />
              <span style={{ fontSize: '11px', color: '#3A3A50', marginLeft: '6px', letterSpacing: '1px' }}>restrecon ~ terminal</span>
            </div>

            {/* Lines */}
            {terminalLines.map((line, i) => (
              <div key={i} style={{ fontSize: '12px', lineHeight: '1.8', fontFamily: 'monospace', color: colors[line.cls] || '#555580' }}>
                {line.text || '\u00A0'}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage