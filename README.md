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

---

## ⚙️ Setup & Run

**Frontend**
```bash
npm install
npm run dev
```

**Backend**
```bash
cd backend
npm install
node index.js
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`

---

## ⚠️ Disclaimer

RestRecon is built for **educational purposes and authorized security testing only**.  
Only test APIs you own or have explicit permission to test.  
Unauthorized scanning is illegal under IT Act Section 43 & 66.

---

## 👨‍💻 Author

**Lakshya Raj** — B.Tech ITNS, NSUT Delhi  
[GitHub](https://github.com/Lakshya-Raj07) · [Portfolio](https://lakshyaraj.vercel.app)
