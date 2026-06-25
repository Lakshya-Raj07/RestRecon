import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cols = Math.floor(canvas.width / 16)
    const drops = Array(cols).fill(1)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'

    const draw = () => {
      ctx.fillStyle = 'rgba(14,12,20,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00FF41'
      ctx.font = '13px monospace'
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * 16, y * 16)
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }

    const interval = setInterval(draw, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: '#0E0C14', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Matrix Rain */}
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, opacity: 0.15, zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid #1A1A2E' }}>
        <div style={{ color: '#00FF41', fontSize: '16px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'monospace' }}>
          REST<span style={{ color: '#fff' }}>Recon</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span style={{ color: '#555566', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'monospace' }}>DOCS</span>
          <span style={{ color: '#555566', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'monospace' }}>ABOUT</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', textAlign: 'center', padding: '2rem' }}>

        {/* Badge */}
        <div style={{ display: 'inline-block', border: '1px solid #00FF41', color: '#00FF41', fontSize: '11px', padding: '4px 14px', borderRadius: '2px', letterSpacing: '2px', marginBottom: '1.5rem', opacity: 0.8, fontFamily: 'monospace' }}>
          OWASP API TOP 10 · AUTOMATED
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: '46px', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '0.75rem', fontFamily: 'monospace' }}>
          We attack your API<br />
          <span style={{ color: '#00FF41' }}> so hackers don't.</span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '14px', color: '#8A8A9A', maxWidth: '420px', lineHeight: 1.7, marginBottom: '2rem' }}>
          6 automated attack modules. Zero setup. Full vulnerability report in seconds.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: '#00FF41', color: '#0E0C14', border: 'none', padding: '12px 32px', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', cursor: 'pointer', borderRadius: '2px', fontFamily: 'monospace' }}
          >
            START SCANNING →
          </button>
          <button
            style={{ background: 'transparent', color: '#00FF41', border: '1px solid #00FF41', padding: '12px 32px', fontSize: '14px', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer', borderRadius: '2px', fontFamily: 'monospace' }}
          >
            VIEW DEMO
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#00FF41', fontFamily: 'monospace' }}>6</div>
            <div style={{ fontSize: '11px', color: '#555566', letterSpacing: '1px', marginTop: '2px' }}>ATTACK MODULES</div>
          </div>
          <div style={{ width: '1px', height: '30px', background: '#1A1A2E' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#00FF41', fontFamily: 'monospace' }}>OWASP</div>
            <div style={{ fontSize: '11px', color: '#555566', letterSpacing: '1px', marginTop: '2px' }}>API TOP 10</div>
          </div>
          <div style={{ width: '1px', height: '30px', background: '#1A1A2E' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#00FF41', fontFamily: 'monospace' }}>PDF</div>
            <div style={{ fontSize: '11px', color: '#555566', letterSpacing: '1px', marginTop: '2px' }}>EXPORT REPORT</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LandingPage