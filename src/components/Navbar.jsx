import { useNavigate } from 'react-router-dom'

function Navbar({ status }) {
    const navigate = useNavigate()
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 2rem',
            borderBottom: '1px solid #1A1A2E',
            background: '#0E0C14',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            {/* Logo */}
            <div onClick={() => navigate('/')} style={{ color: '#00FF41', fontSize: '16px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'monospace', cursor: 'pointer' }}>
                REST<span style={{ color: '#fff' }}>Recon</span>
            </div>

            {/* Status */}
            {status && (
                <div style={{ fontSize: '11px', color: '#555566', letterSpacing: '1px', fontFamily: 'monospace' }}>
                    {status === 'ready' && '● READY TO SCAN'}
                    {status === 'running' && <span style={{ color: '#00FF41' }}>● SCANNING...</span>}
                    {status === 'complete' && <span style={{ color: '#00FF41' }}>● SCAN COMPLETE</span>}
                </div>
            )}

            {/* Nav Links */}
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <span style={{ color: '#555566', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'monospace' }}>DOCS</span>
                <span style={{ color: '#555566', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'monospace' }}>ABOUT</span>
            </div>
        </nav>
    )
}

export default Navbar