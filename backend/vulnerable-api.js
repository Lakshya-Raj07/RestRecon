const express = require('express')
const app = express()
app.use(express.json())

// Fake user database
const users = {
    1: { id: 1, name: 'Michael Moron', email: 'Michael@moron.ac.in', password: 'secret123', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.tokenA' },
    2: { id: 2, name: 'John Doe', email: 'john@example.com', password: 'john456', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.tokenB' },
}

// VULNERABLE — No auth check, IDOR possible
app.get('/user/:id', (req, res) => {
    const user = users[req.params.id]
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user) // Returns password + token — Sensitive Data exposure too!
})

// VULNERABLE — SQLi simulation
app.get('/search', (req, res) => {
    const q = req.query.input || req.query.q || req.query.search || ''
    if (q.includes("'") || q.toLowerCase().includes('or') || q.includes('--') || q.includes('union')) {
        return res.status(500).json({
            error: 'postgresql syntax error near unexpected token',
            query: q
        })
    }
    res.json({ results: [] })
})

// VULNERABLE — No auth required
app.get('/admin', (req, res) => {
    res.json({ users, secret: 'AKIA1234567890ABCDEF' }) // AWS key exposed!
})

// No rate limiting, no security headers
app.listen(4000, () => {
    console.log('[*] Vulnerable test API running on port 4000')
})