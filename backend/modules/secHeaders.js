const axios = require('axios')

const requiredHeaders = [
    { name: 'strict-transport-security', label: 'Strict-Transport-Security (HSTS)' },
    { name: 'content-security-policy', label: 'Content-Security-Policy (CSP)' },
    { name: 'x-frame-options', label: 'X-Frame-Options' },
    { name: 'x-content-type-options', label: 'X-Content-Type-Options' },
    { name: 'referrer-policy', label: 'Referrer-Policy' },
]

async function checkSecHeaders(target) {
    try {
        const res = await axios({
            method: 'GET',
            url: target,
            validateStatus: () => true
        })

        const responseHeaders = res.headers
        const missing = []

        requiredHeaders.forEach(h => {
            if (!responseHeaders[h.name]) {
                missing.push(h.label)
            }
        })

        if (missing.length > 0) {
            return {
                module: 'SECURITY HEADERS',
                severity: missing.length >= 3 ? 'HIGH' : 'MEDIUM',
                vulnerable: true,
                detail: `Missing security headers: ${missing.join(', ')}`
            }
        }

        return {
            module: 'SECURITY HEADERS',
            severity: 'PASSED',
            vulnerable: false,
            detail: 'All required security headers are present.'
        }

    } catch (err) {
        return {
            module: 'SECURITY HEADERS',
            severity: 'SKIPPED',
            vulnerable: false,
            detail: `Request failed: ${err.message}`
        }
    }
}

module.exports = checkSecHeaders