# 🔍 email-verifier

A lightweight Node.js package to validate email addresses using format checks, MX DNS records, and optional SMTP inbox verification — all without external dependencies.

---

## 🚀 Features

- ✅ Email syntax validation
- 🔁 MX record lookup (checks domain can receive emails)
- 🛡️ Disposable email detection
- 📬 Optional SMTP inbox existence check *(⚠️ not 100% reliable)*

---

## 📦 Installation

```bash
npm install -S email-verifier
```

## 🧠 Usage

```javascript
const { verifyEmail } = require('email-verifier');

(async () => {
  const result = await verifyEmail('someone@example.com', {
    checkInbox: true, // Optional: check if inbox actually exists
    checkMX: true //Optional: check DNS MX records
  });
  console.log(result);
})();
```

## 📘 API

`verifyEmail(email, options)`

Performs full email verification.

Parameters:

| Name             | Type      | Default | Description                                                  |
|------------------|-----------|---------|--------------------------------------------------------------|
| `email`          | `string`  | —       | The email address to verify                                  |
| `options`        | `object`  | `{}`    | Options object to customize verification behavior            |
| `options.checkInbox` | `boolean` | `false` | Whether to check if the inbox exists via SMTP (optional)     |
| `options.checkMX` | `boolean` | `false` | Whether to check if the inbox exists via SMTP (optional)     |
