const axios = require('axios')

async function checkIDOR(target, headers, tokenA, tokenB) {
    // Agar dono tokens nahi hain toh skip
    if (!tokenA || !tokenB) {
        return {
            module: 'BOLA / IDOR',
            severity: 'SKIPPED',
            vulnerable: false,
            detail: 'Two tokens required for IDOR check. Skipped.'
        }
    }

    try {
        // Token A se request bhejo — apna data
        const resA = await axios({
            method: 'GET',
            url: target,
            headers: { ...headers, Authorization: tokenA }
        })

        // Token B se same endpoint pe request bhejo
        const resB = await axios({
            method: 'GET',
            url: target,
            headers: { ...headers, Authorization: tokenB }
        })

        // Dono responses same hain? IDOR confirmed
        const dataA = JSON.stringify(resA.data)
        const dataB = JSON.stringify(resB.data)

        if (resB.status === 200 && dataA === dataB && dataA !== '{}' && dataA !== 'null') {
            return {
                module: 'BOLA / IDOR',
                severity: 'CRITICAL',
                vulnerable: true,
                detail: 'Token B accessed Token A data — BOLA/IDOR confirmed. Cross-account data exposure detected.'
            }
        }

        return {
            module: 'BOLA / IDOR',
            severity: 'PASSED',
            vulnerable: false,
            detail: 'Tokens returned different data. No IDOR detected.'
        }

    } catch (err) {
        return {
            module: 'BOLA / IDOR',
            severity: 'SKIPPED',
            vulnerable: false,
            detail: `Request failed: ${err.message}`
        }
    }
}

module.exports = checkIDOR