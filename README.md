# RestRecon 🔍

> **Automated REST API Penetration Testing Tool — OWASP API Top 10**

RestRecon is a full-stack security tool that fires real attack payloads against REST API endpoints and generates a detailed vulnerability report.

---

## 🚀 Features

- **6 Automated Attack Modules** based on OWASP API Top 10
- **Live Terminal Console** — watch attacks execute in real-time
- **API Security Score** — 0-100 risk rating
- **PDF Export** — downloadable vulnerability report
- **Clean Dashboard** — configure and launch scans in seconds

---

## 🛡️ Attack Modules

| Module | Type | Description |
|---|---|---|
| BOLA / IDOR | Critical | Dual-token cross-match to detect broken object level authorization |
| SQL Injection | High | Payload fuzzing + regex body scan for error-based SQLi |
| Broken Auth | High | Auth header stripping to test unenforced authentication |
| Sensitive Data | High | Regex scan for JWT tokens, AWS keys, plaintext secrets |
| Security Headers | Medium | Checks for missing HSTS, CSP, X-Frame-Options and more |
| Rate Limiting | High | 50 concurrent async requests via Promise.all() to test DoS protection |

---

## 🧱 Tech Stack

**Frontend**
- React + Vite
- React Router DOM
- Tailwind CSS
- html2pdf.js

**Backend**
- Node.js + Express
- Axios
- CORS

---

## 📁 Project Structure
