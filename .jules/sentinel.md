
## 2023-10-27 - HTML Injection in Backend Email Template
**Vulnerability:** The Brevo email template constructed in `functions/api/contact.js` used a custom `esc` function that only escaped `&`, `<`, and `>`. It failed to escape `"` and `'`, allowing HTML attribute injection (e.g., in `<a href="mailto:${esc(cleanEmail)}">`) because the email regex `EMAIL_REGEX` permitted quotes in the local part of the email address.
**Learning:** Even when basic input validation (like an email regex) is present, template interpolation into HTML attributes requires comprehensive HTML entity escaping, including quotes.
**Prevention:** Always ensure custom HTML escaping functions cover all 5 critical entities: `&`, `<`, `>`, `"`, and `'`.
