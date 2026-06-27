const axios = require('axios')

async function checkBrokenAuth(target, method, headers) {
    try {
        // Check karo ki user ne auth headers diye bhi hain ya nahi
        const hasAuth = headers && (
            headers['Authorization'] || headers['authorization'] ||
            headers['Cookie'] || headers['cookie']
        )

        // Auth header hata ke request bhejo
        const strippedHeaders = { ...headers }
        delete strippedHeaders['Authorization']
        delete strippedHeaders['authorization']
        delete strippedHeaders['Cookie']
        delete strippedHeaders['cookie']

        const resWithoutAuth = await axios({
            method: method || 'GET',
            url: target,
            headers: strippedHeaders,
            validateStatus: () => true
        })

        // 401 ya 403 aaya? Auth enforced hai — PASSED
        if (resWithoutAuth.status === 401 || resWithoutAuth.status === 403) {
            return {
                module: 'BROKEN AUTH',
                severity: 'PASSED',
                vulnerable: false,
                detail: `Endpoint correctly returned ${resWithoutAuth.status} when Authorization header was stripped.`
            }
        }

        // 302/301 redirect to login? Auth enforced hai — PASSED
        if (resWithoutAuth.status === 301 || resWithoutAuth.status === 302) {
            return {
                module: 'BROKEN AUTH',
                severity: 'PASSED',
                vulnerable: false,
                detail: `Endpoint redirected (${resWithoutAuth.status}) without auth — likely redirecting to login.`
            }
        }

        // 200 aaya bina auth ke
        if (resWithoutAuth.status === 200) {
            // Agar user ne auth headers diye hi nahi the — toh compare nahi kar sakte
            // Yeh likely ek public endpoint hai
            if (!hasAuth) {
                return {
                    module: 'BROKEN AUTH',
                    severity: 'MEDIUM',
                    vulnerable: false,
                    detail: 'Endpoint returned 200 without auth, but no auth tokens were provided for comparison. Likely a public endpoint.'
                }
            }

            // Auth headers diye the — ab compare karo WITH auth vs WITHOUT auth
            const resWithAuth = await axios({
                method: method || 'GET',
                url: target,
                headers: { ...headers },
                validateStatus: () => true
            })

            const bodyWithout = JSON.stringify(resWithoutAuth.data)
            const bodyWith = JSON.stringify(resWithAuth.data)

            // Dono same data return kar rahe? Public endpoint hai
            if (bodyWithout === bodyWith) {
                return {
                    module: 'BROKEN AUTH',
                    severity: 'MEDIUM',
                    vulnerable: false,
                    detail: 'Endpoint returned same data with and without auth. Likely a public endpoint — not a vulnerability.'
                }
            }

            // Different data? Broken auth confirmed!
            return {
                module: 'BROKEN AUTH',
                severity: 'HIGH',
                vulnerable: true,
                detail: 'Endpoint returned 200 OK without auth, but response differs from authenticated request. Authentication not properly enforced — sensitive data may be partially exposed.'
            }
        }

        return {
            module: 'BROKEN AUTH',
            severity: 'MEDIUM',
            vulnerable: false,
            detail: `Endpoint returned ${resWithoutAuth.status} without auth header. Manual review recommended.`
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
