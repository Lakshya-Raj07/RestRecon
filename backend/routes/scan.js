const express = require('express')
const router = express.Router()

const checkIDOR = require('../modules/idor')
const checkSQLi = require('../modules/sqli')
const checkBrokenAuth = require('../modules/brokenAuth')
const checkSensitiveData = require('../modules/sensitiveData')
const checkSecHeaders = require('../modules/secHeaders')
const checkRateLimit = require('../modules/rateLimit')

router.post('/', async (req, res) => {
    const { baseUrl, endpoint, method, headers, tokenA, tokenB } = req.body

    const target = `${baseUrl}${endpoint}`

    try {
        const results = await Promise.allSettled([
            checkIDOR(target, headers, tokenA, tokenB),
            checkSQLi(target, method, headers),
            checkBrokenAuth(target, method, headers),
            checkSensitiveData(target, method, headers),
            checkSecHeaders(target),
            checkRateLimit(target, method, headers),
        ])

        const [idor, sqli, brokenAuth, sensitiveData, secHeaders, rateLimit] = results.map(r =>
            r.status === 'fulfilled' ? r.value : { vulnerable: false, detail: 'Module error', error: true }
        )

        res.json({
            score: calculateScore([idor, sqli, brokenAuth, sensitiveData, secHeaders, rateLimit]),
            findings: { idor, sqli, brokenAuth, sensitiveData, secHeaders, rateLimit }
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

function calculateScore(results) {
    const weights = { CRITICAL: 30, HIGH: 15, MEDIUM: 8, PASSED: 0 }
    let deduction = 0
    results.forEach(r => {
        deduction += weights[r.severity] || 0
    })
    return Math.max(0, 100 - deduction)
}

module.exports = router