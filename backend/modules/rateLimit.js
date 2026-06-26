const axios = require('axios')

async function checkRateLimit(target, method, headers) {
    try {
        // 50 concurrent requests Promise.all() se
        const requests = Array(50).fill(null).map(() =>
            axios({
                method: method || 'GET',
                url: target,
                headers,
                validateStatus: () => true
            })
        )

        const responses = await Promise.all(requests)

        // Koi bhi 429 aaya?
        const limited = responses.some(r => r.status === 429)

        if (limited) {
            return {
                module: 'RATE LIMITING',
                severity: 'PASSED',
                vulnerable: false,
                detail: '429 Too Many Requests received. Rate limiting is properly implemented.'
            }
        }

        return {
            module: 'RATE LIMITING',
            severity: 'HIGH',
            vulnerable: true,
            detail: '50 concurrent async requests fired via Promise.all() — no 429 received. Rate limiting absent. API vulnerable to brute force and DoS attacks.'
        }

    } catch (err) {
        return {
            module: 'RATE LIMITING',
            severity: 'SKIPPED',
            vulnerable: false,
            detail: `Request failed: ${err.message}`
        }
    }
}

module.exports = checkRateLimit