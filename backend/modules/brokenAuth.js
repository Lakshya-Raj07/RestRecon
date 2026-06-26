const axios = require('axios')

async function checkBrokenAuth(target, method, headers) {
    try {
        // Auth header hata ke request bhejo
        const strippedHeaders = { ...headers }
        delete strippedHeaders['Authorization']
        delete strippedHeaders['authorization']
        delete strippedHeaders['Cookie']
        delete strippedHeaders['cookie']

        const res = await axios({
            method: method || 'GET',
            url: target,
            headers: strippedHeaders,
            validateStatus: () => true
        })

        // 200 aaya bina auth ke? Vulnerable
        if (res.status === 200) {
            return {
                module: 'BROKEN AUTH',
                severity: 'HIGH',
                vulnerable: true,
                detail: `Endpoint returned 200 OK without Authorization header. Authentication not enforced.`
            }
        }

        // 401 ya 403 aaya? Sahi hai
        if (res.status === 401 || res.status === 403) {
            return {
                module: 'BROKEN AUTH',
                severity: 'PASSED',
                vulnerable: false,
                detail: `Endpoint correctly returned ${res.status} when Authorization header was stripped.`
            }
        }

        return {
            module: 'BROKEN AUTH',
            severity: 'MEDIUM',
            vulnerable: false,
            detail: `Endpoint returned ${res.status} without auth header. Manual review recommended.`
        }

    } catch (err) {
        return {
            module: 'BROKEN AUTH',
            severity: 'SKIPPED',
            vulnerable: false,
            detail: `Request failed: ${err.message}`
        }
    }
}

module.exports = checkBrokenAuth