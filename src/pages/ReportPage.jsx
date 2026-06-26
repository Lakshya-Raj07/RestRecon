import Navbar from '../components/Navbar'
import { useState } from 'react'
import html2pdf from 'html2pdf.js'

const findings = [
  {
    id: 1,
    module: 'BOLA / IDOR',
    severity: 'CRITICAL',
    color: '#FF3E3E',
    detail: 'Token B was able to access resources intended exclusively for Token A at endpoint /user/profile. Cross-account data exposure confirmed.',
    fix: 'Implement object-level authorization checks on every endpoint.'
  },
  {
    id: 2,
    module: 'SQL INJECTION',
    severity: 'HIGH',
    color: '#FF6B35',
    detail: "Input parameter leaked raw PostgreSQL syntax error when injected with ' OR 1=1 --. Error-based SQLi confirmed via regex body scan.",
    fix: 'Use parameterized queries / prepared statements.'
  },
  {
    id: 3,
    module: 'BROKEN AUTH',
    severity: 'PASSED',
    color: '#00FF41',
    detail: 'Endpoint correctly returned 401 Unauthorized when Authorization header was stripped.',
    fix: null
  },
  {
    id: 4,
    module: 'SENSITIVE DATA',
    severity: 'HIGH',
    color: '#FF6B35',
    detail: 'Live JWT token matching pattern eyJ... detected in response body. Token should never be exposed in API responses.',
    fix: 'Never return auth tokens in response payloads.'
  },
  {
    id: 5,
    module: 'SECURITY HEADERS',
    severity: 'MEDIUM',
    color: '#FFB800',
    detail: 'Missing headers: Strict-Transport-Security (HSTS), Content-Security-Policy (CSP).',
    fix: 'Add missing headers in server configuration.'
  },
  {
    id: 6,
    module: 'RATE LIMITING',
    severity: 'HIGH',
    color: '#FF6B35',
    detail: '50 concurrent async requests fired via Promise.all() — no 429 Too Many Requests received. API vulnerable to brute force and DoS.',
    fix: 'Implement rate limiting middleware (e.g., express-rate-limit).'
  },
]

function ReportPage() {
  const [openId, setOpenId] = useState(null)

  return (
    <div style={{ background: '#0E0C14', minHeight: '100vh', fontFamily: 'monospace' }} id="report-content">
      <Navbar status="complete" />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: '1px' }}>TARGET: </span>
          <span style={{ fontSize: '11px', color: '#555566' }}>https://api.target.com/v1/user/1</span>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: '1px' }}>METHOD: </span>
          <span style={{ fontSize: '11px', color: '#555566' }}>GET</span>
          <span style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: '1px', marginLeft: '1rem' }}>SCANNED: </span>
          <span style={{ fontSize: '11px', color: '#555566' }}>{new Date().toLocaleString()}</span>
        </div>

        {/* Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', padding: '1.5rem', background: '#13111D', border: '1px solid #2A2840', borderRadius: '2px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', fontWeight: 700, color: '#FF3E3E', lineHeight: 1, fontFamily: 'monospace' }}>28</div>
            <div style={{ fontSize: '24px', color: '#555566' }}>/ 100</div>
            <div style={{ fontSize: '10px', color: '#555566', letterSpacing: '3px', marginTop: '4px' }}>API SECURITY SCORE</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', border: '1px solid #FF3E3E', color: '#FF3E3E', fontSize: '11px', padding: '4px 14px', borderRadius: '2px', letterSpacing: '2px', marginBottom: '1rem' }}>
              CRITICAL RISK
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'CRITICAL', count: 1, color: '#FF3E3E' },
                { label: 'HIGH', count: 3, color: '#FF6B35' },
                { label: 'MEDIUM', count: 1, color: '#FFB800' },
                { label: 'PASSED', count: 1, color: '#00FF41' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: '1px', width: '70px' }}>{s.label}</span>
                  <span style={{ fontSize: '11px', color: s.color, fontWeight: 700 }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div style={{ fontSize: '10px', color: '#555566', letterSpacing: '2px', marginBottom: '1rem' }}>VULNERABILITY FINDINGS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
          {findings.map(f => (
            <div key={f.id} onClick={() => setOpenId(openId === f.id ? null : f.id)}
              style={{ background: '#13111D', border: '1px solid #2A2840', borderLeft: `3px solid ${f.color}`, borderRadius: '2px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
                <span style={{ fontSize: '13px', color: '#E0E0E0', letterSpacing: '1px' }}>{f.module}</span>
                <span style={{ fontSize: '11px', color: f.color, border: `1px solid ${f.color}`, padding: '2px 10px', borderRadius: '2px', letterSpacing: '1px' }}>{f.severity}</span>
              </div>
              {openId === f.id && (
                <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid #2A2840' }}>
                  <p style={{ fontSize: '12px', color: '#8A8A9A', lineHeight: 1.7, marginTop: '0.75rem' }}>{f.detail}</p>
                  {f.fix && (
                    <p style={{ fontSize: '12px', color: '#00FF41', marginTop: '0.5rem' }}>► Fix: {f.fix}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Export Button */}
        <button onClick={exportPDF} style={{ width: '100%', background: 'transparent', color: '#00FF41', border: '1px solid #00FF41', padding: '13px', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer', borderRadius: '2px', fontFamily: 'monospace' }}>
          [ EXPORT THREAT REPORT (PDF) ]
        </button>

      </div>
    </div>
  )
}
const exportPDF = () => {
  const element = document.getElementById('report-content')
  const opt = {
    margin: 0.5,
    filename: 'RestRecon-Report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: '#0E0C14' },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }
  html2pdf().set(opt).from(element).save()
}

export default ReportPage