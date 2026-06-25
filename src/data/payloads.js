export const sqliPayloads = [
  "' OR 1=1 --",
  "' OR '1'='1",
  "'; DROP TABLE users --",
  "' UNION SELECT null --",
  "1' AND SLEEP(5) --",
];

export const sqliErrorKeywords = [
  "sql", "syntax", "mysql", "postgresql", "sqlite",
  "driver", "odbc", "ora-", "microsoft jet", "warning: pg_"
];

export const sensitiveKeywords = [
  /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, // JWT
  /AKIA[0-9A-Z]{16}/g,                                      // AWS Key
  /[0-9a-f]{32}/g,                                          // MD5 hash
];

export const securityHeaders = [
  "strict-transport-security",
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
];

export const idorPatterns = [
  (id) => id + 1,
  (id) => id - 1,
  (id) => 0,
  (id) => 99999,
  (id) => -1,
];