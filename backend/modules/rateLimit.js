const axios = require('axios')

async function checkRateLimit(target, method, headers) {
    try {
        // 20 requests sufficient hain 429 detect karne ke liye
        const requests = Array(20).fill(null).map(() =>
            axios({
                method: method || 'GET',
                url: target,
                headers,
                validateStatus: () => true,
                timeout: 5000
            })
        )

        const responses = await Promise.all(requests)
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
            detail: '20 concurrent async requests fired — no 429 received. Rate limiting absent.'
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