import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import html2pdf from 'html2pdf.js'

// Severity color mapping
const severityColors = {
  CRITICAL: '#FF3E3E',
  HIGH: '#FF6B35',
  MEDIUM: '#FFB800',
  PASSED: '#00FF41',
  SKIPPED: '#555580',
}

function ReportPage() {
  const [openId, setOpenId] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Redirect if no scan data
  useEffect(() => {
    if (!location.state) {
      navigate('/dashboard')
    }
  }, [location.state, navigate])

  if (!location.state) return null

  const { score, findings, target, method } = location.state

  // Transform findings object → array for rendering
  const findingsArray = [
    { key: 'idor', ...findings.idor },
    { key: 'sqli', ...findings.sqli },
    { key: 'brokenAuth', ...findings.brokenAuth },
    { key: 'sensitiveData', ...findings.sensitiveData },
    { key: 'secHeaders', ...findings.secHeaders },
    { key: 'rateLimit', ...findings.rateLimit },
  ].filter(f => f.module) // filter out any undefined

  // Calculate severity counts
  const severityCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, PASSED: 0, SKIPPED: 0 }
  findingsArray.forEach(f => {
    if (severityCounts[f.severity] !== undefined) {
      severityCounts[f.severity]++
    }
  })

  // Risk label
  const riskLabel = score <= 30 ? 'CRITICAL RISK' : score <= 50 ? 'HIGH RISK' : score <= 70 ? 'MODERATE RISK' : 'LOW RISK'
  const riskColor = score <= 30 ? '#FF3E3E' : score <= 50 ? '#FF6B35' : score <= 70 ? '#FFB800' : '#00FF41'

  // Fix recommendations per module
  const fixMap = {
    'BOLA / IDOR': 'Implement object-level authorization checks on every endpoint.',
    'SQL INJECTION': 'Use parameterized queries / prepared statements.',
    'BROKEN AUTH': 'Ensure all endpoints require valid authentication tokens.',
    'SENSITIVE DATA': 'Never return auth tokens, secrets, or keys in response payloads.',
    'SECURITY HEADERS': 'Add missing headers in server configuration (HSTS, CSP, X-Frame-Options, etc.).',
    'RATE LIMITING': 'Implement rate limiting middleware (e.g., express-rate-limit).',
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

  return (
    <div style={{ background: '#0E0C14', minHeight: '100vh', fontFamily: 'monospace' }} id="report-content">
      <Navbar status="complete" />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: '1px' }}>TARGET: </span>
          <span style={{ fontSize: '11px', color: '#555566' }}>{target}</span>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: '1px' }}>METHOD: </span>
          <span style={{ fontSize: '11px', color: '#555566' }}>{method}</span>
          <span style={{ fontSize: '11px', color: '#8A8A9A', letterSpacing: '1px', marginLeft: '1rem' }}>SCANNED: </span>
          <span style={{ fontSize: '11px', color: '#555566' }}>{new Date().toLocaleString()}</span>
        </div>

        {/* Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', padding: '1.5rem', background: '#13111D', border: '1px solid #2A2840', borderRadius: '2px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', fontWeight: 700, color: riskColor, lineHeight: 1, fontFamily: 'monospace' }}>{score}</div>
            <div style={{ fontSize: '24px', color: '#555566' }}>/ 100</div>
            <div style={{ fontSize: '10px', color: '#555566', letterSpacing: '3px', marginTop: '4px' }}>API SECURITY SCORE</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', border: `1px solid ${riskColor}`, color: riskColor, fontSize: '11px', padding: '4px 14px', borderRadius: '2px', letterSpacing: '2px', marginBottom: '1rem' }}>
              {riskLabel}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'CRITICAL', count: severityCounts.CRITICAL, color: '#FF3E3E' },
                { label: 'HIGH', count: severityCounts.HIGH, color: '#FF6B35' },
                { label: 'MEDIUM', count: severityCounts.MEDIUM, color: '#FFB800' },
                { label: 'PASSED', count: severityCounts.PASSED, color: '#00FF41' },
                { label: 'SKIPPED', count: severityCounts.SKIPPED, color: '#555580' },
              ].filter(s => s.count > 0).map(s => (
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
          {findingsArray.map((f, idx) => (
            <div key={f.key || idx} onClick={() => setOpenId(openId === idx ? null : idx)}
              style={{ background: '#13111D', border: '1px solid #2A2840', borderLeft: `3px solid ${severityColors[f.severity] || '#555580'}`, borderRadius: '2px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
                <span style={{ fontSize: '13px', color: '#E0E0E0', letterSpacing: '1px' }}>{f.module}</span>
                <span style={{ fontSize: '11px', color: severityColors[f.severity] || '#555580', border: `1px solid ${severityColors[f.severity] || '#555580'}`, padding: '2px 10px', borderRadius: '2px', letterSpacing: '1px' }}>{f.severity}</span>
              </div>
              {openId === idx && (
                <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid #2A2840' }}>
                  <p style={{ fontSize: '12px', color: '#8A8A9A', lineHeight: 1.7, marginTop: '0.75rem' }}>{f.detail}</p>
                  {f.vulnerable && fixMap[f.module] && (
                    <p style={{ fontSize: '12px', color: '#00FF41', marginTop: '0.5rem' }}>► Fix: {fixMap[f.module]}</p>
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

export default ReportPage