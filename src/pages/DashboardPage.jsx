import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function DashboardPage() {
  const [activeMethod, setActiveMethod] = useState('GET')
  const [activeTab, setActiveTab] = useState('HEADERS')
  const [scanning, setScanning] = useState(false)
  const [terminalLines, setTerminalLines] = useState([
    { text: '[*] RestRecon v1.0 — Ready', cls: 'info' },
    { text: '[*] Configure target and hit INITIALIZE SCAN', cls: 'info' },
  ])
  const navigate = useNavigate()

  const colors = {
    info: '#555580',
    cmd: '#00D4FF',
    safe: '#00FF41',
    warn: '#FFB800',
    vuln: '#FF3E3E',
  }

  const scanLines = [
    { text: '[*] Starting scan engine...', cls: 'info', delay: 300 },
    { text: '[*] Loading 6 attack modules...', cls: 'info', delay: 700 },
    { text: '', delay: 1000 },
    { text: '[MODULE 01] BOLA/IDOR — Dual-token cross-match', cls: 'cmd', delay: 1300 },
    { text: '[TEST] Sending Token B to Token A endpoint...', cls: 'info', delay: 1800 },
    { text: '[!] CRITICAL: Token B accessed Token A data — BOLA confirmed', cls: 'vuln', delay: 2400 },
    { text: '', delay: 2600 },
    { text: "[MODULE 02] SQL INJECTION — Payload fuzzing", cls: 'cmd', delay: 2900 },
    { text: "[TEST] Injecting: ' OR 1=1 --", cls: 'info', delay: 3400 },
    { text: '[WARN] Response body leaked: "PostgreSQL syntax error"', cls: 'warn', delay: 3900 },
    { text: '[!] HIGH: Error-based SQLi detected', cls: 'vuln', delay: 4300 },
    { text: '', delay: 4500 },
    { text: '[MODULE 03] BROKEN AUTH — Header stripping', cls: 'cmd', delay: 4800 },
    { text: '[TEST] Sending request without Authorization header...', cls: 'info', delay: 5300 },
    { text: '[+] SAFE: 401 Unauthorized returned correctly', cls: 'safe', delay: 5800 },
    { text: '', delay: 6000 },
    { text: '[MODULE 04] SENSITIVE DATA — Regex pattern scan', cls: 'cmd', delay: 6300 },
    { text: '[TEST] Scanning response for JWT, AWS keys...', cls: 'info', delay: 6800 },
    { text: '[!] HIGH: Live JWT token exposed in response body', cls: 'vuln', delay: 7300 },
    { text: '', delay: 7500 },
    { text: '[MODULE 05] SECURITY HEADERS — Compliance check', cls: 'cmd', delay: 7800 },
    { text: '[WARN] Missing: Strict-Transport-Security (HSTS)', cls: 'warn', delay: 8300 },
    { text: '[WARN] Missing: Content-Security-Policy (CSP)', cls: 'warn', delay: 8600 },
    { text: '', delay: 8800 },
    { text: '[MODULE 06] RATE LIMITING — Concurrency burst', cls: 'cmd', delay: 9100 },
    { text: '[TEST] Firing 50 async requests via Promise.all()...', cls: 'info', delay: 9600 },
    { text: '[!] HIGH: No 429 received — Rate limiting absent', cls: 'vuln', delay: 10400 },
    { text: '', delay: 10600 },
    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', cls: 'info', delay: 10900 },
    { text: '[✓] SCAN COMPLETE — 5 vulnerabilities found', cls: 'vuln', delay: 11200 },
    { text: '[*] API SECURITY SCORE: 28/100 — CRITICAL', cls: 'vuln', delay: 11500 },
  ]

  const runScan = () => {
    setScanning(true)
    setTerminalLines([])
    scanLines.forEach(({ text, cls, delay }) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, { text, cls }])
      }, delay)
    })
    setTimeout(() => {
      setScanning(false)
      navigate('/report')
    }, 13000)
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
            <input placeholder="https://api.target.com" style={{ width: '100%', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px' }} />
          </div>

          {/* Endpoint */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', color: '#8A8A9A', marginBottom: '6px', letterSpacing: '1px' }}>ENDPOINT</div>
            <input placeholder="/v1/user/1" style={{ width: '100%', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px' }} />
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
                <input placeholder="Bearer eyJhbGci..." style={{ width: '100%', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#8A8A9A', marginBottom: '6px', letterSpacing: '1px' }}>TOKEN B (SECOND USER)</div>
                <input placeholder="Bearer eyJhbGci..." style={{ width: '100%', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px' }} />
              </div>
            </div>
          ) : (
            <textarea placeholder={activeTab === 'HEADERS' ? 'Authorization: Bearer token...' : '{ "key": "value" }'} style={{ width: '100%', height: '80px', background: '#13111D', border: '1px solid #2A2840', color: '#E0E0E0', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', borderRadius: '2px', resize: 'none' }} />
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
          <button onClick={runScan} disabled={scanning} style={{ width: '100%', background: '#00FF41', color: '#0E0C14', border: 'none', padding: '13px', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', cursor: scanning ? 'not-allowed' : 'pointer', borderRadius: '2px', fontFamily: 'monospace', opacity: scanning ? 0.7 : 1 }}>
            {scanning ? '⚡ SCANNING...' : '⚡ INITIALIZE SCAN'}
          </button>
        </div>

        {/* RIGHT — Terminal */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '10px', color: '#555566', letterSpacing: '2px', marginBottom: '1rem' }}>LIVE EXECUTION CONSOLE</div>
          <div style={{ background: '#080710', border: '1px solid #1A1A2E', borderRadius: '2px', flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
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