const axios = require('axios')

const patterns = [
    { name: 'JWT Token', regex: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/ },
    { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
    { name: 'Private Key', regex: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
    { name: 'Password in response', regex: /"password"\s*:\s*"[^"]{3,}"/ },
    { name: 'Secret in response', regex: /"secret"\s*:\s*"[^"]{3,}"/ },
]

async function checkSensitiveData(target, method, headers) {
    try {
        const res = await axios({
            method: method || 'GET',
            url: target,
            headers,
            validateStatus: () => true
        })

        const body = JSON.stringify(res.data)

        for (const pattern of patterns) {
            if (pattern.regex.test(body)) {
                return {
                    module: 'SENSITIVE DATA',
                    severity: 'HIGH',
                    vulnerable: true,
                    detail: `${pattern.name} pattern detected in response body. Sensitive data exposure confirmed.`
                }
            }
        }

        return {
            module: 'SENSITIVE DATA',
            severity: 'PASSED',
            vulnerable: false,
            detail: 'No sensitive data patterns found in response body.'
        }

    } catch (err) {
        return {
            module: 'SENSITIVE DATA',
            severity: 'SKIPPED',
            vulnerable: false,
            detail: `Request failed: ${err.message}`
        }
    }
}

module.exports = checkSensitiveData