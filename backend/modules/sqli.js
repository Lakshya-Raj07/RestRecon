const axios = require('axios')

const payloads = [
    "' OR 1=1 --",
    "' OR '1'='1",
    "'; DROP TABLE users --",
    "' UNION SELECT null --",
]

const errorKeywords = [
    'sql', 'syntax', 'mysql', 'postgresql', 'sqlite',
    'driver', 'odbc', 'ora-', 'microsoft jet', 'warning: pg_'
]

// async function checkSQLi(target, method, headers) {
//     try {
//         for (const payload of payloads) {
//             // URL mein payload inject karo
//             const injectedUrl = `${target}${target.includes('?') ? '&' : '?'}input=${encodeURIComponent(payload)}`

//             const res = await axios({
//                 method: method || 'GET',
//                 url: injectedUrl,
//                 headers,
//                 validateStatus: () => true // 500 pe bhi crash mat karo
//             })

//             const body = JSON.stringify(res.data).toLowerCase()

//             // Response body mein SQL error keywords dhundho
//             const found = errorKeywords.find(kw => body.includes(kw))

//             if (found) {
//                 return {
//                     module: 'SQL INJECTION',
//                     severity: 'HIGH',
//                     vulnerable: true,
//                     detail: `SQL error keyword "${found}" found in response body when injecting payload: ${payload}`
//                 }
//             }

//             // 500 status bhi suspicious hai
//             if (res.status === 500) {
//                 return {
//                     module: 'SQL INJECTION',
//                     severity: 'HIGH',
//                     vulnerable: true,
//                     detail: `Server returned 500 Internal Server Error on payload: ${payload}`
//                 }
//             }
//         }

//         return {
//             module: 'SQL INJECTION',
//             severity: 'PASSED',
//             vulnerable: false,
//             detail: 'No SQL error keywords found in responses. No SQLi detected.'
//         }

//     } catch (err) {
//         return {
//             module: 'SQL INJECTION',
//             severity: 'SKIPPED',
//             vulnerable: false,
//             detail: `Request failed: ${err.message}`
//         }
//     }
// }
async function checkSQLi(target, method, headers) {
    try {
        for (const payload of payloads) {
            let res

            if (method === 'POST' || method === 'PUT') {
                // POST/PUT mein body mein inject karo
                res = await axios({
                    method: method,
                    url: target,
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    data: { input: payload, query: payload, search: payload },
                    validateStatus: () => true,
                    timeout: 5000
                })
            } else {
                // GET mein URL params mein inject karo
                const injectedUrl = `${target}${target.includes('?') ? '&' : '?'}input=${encodeURIComponent(payload)}`
                res = await axios({
                    method: 'GET',
                    url: injectedUrl,
                    headers,
                    validateStatus: () => true,
                    timeout: 5000
                })
            }

            const body = JSON.stringify(res.data).toLowerCase()
            const found = errorKeywords.find(kw => body.includes(kw))

            if (found) {
                return {
                    module: 'SQL INJECTION',
                    severity: 'HIGH',
                    vulnerable: true,
                    detail: `SQL error keyword "${found}" found in response when injecting payload: ${payload}`
                }
            }

            if (res.status === 500) {
                return {
                    module: 'SQL INJECTION',
                    severity: 'HIGH',
                    vulnerable: true,
                    detail: `Server returned 500 on payload: ${payload}`
                }
            }
        }

        return {
            module: 'SQL INJECTION',
            severity: 'PASSED',
            vulnerable: false,
            detail: 'No SQL error keywords found. No SQLi detected.'
        }

    } catch (err) {
        return {
            module: 'SQL INJECTION',
            severity: 'SKIPPED',
            vulnerable: false,
            detail: `Request failed: ${err.message}`
        }
    }
}

module.exports = checkSQLi