#!/usr/bin/env node
/**
 * Send a test email FROM info@uniquedetailing.ru via Resend.
 * Loads RESEND_API_KEY from .env.supabase.local
 */
import { existsSync, readFileSync } from "node:fs";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvFile(new URL("../.env.supabase.local", import.meta.url).pathname);

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("Missing RESEND_API_KEY");
  process.exit(1);
}

const to = process.argv[2] || "nikolaikushin@gmail.com";
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "Unique Detailing <info@uniquedetailing.ru>",
    to: [to],
    subject: "UNIQUE Detailing — тест отправки с info@",
    html: `<p>Тестовое письмо с продакшн-домена.</p>
<p><strong>From:</strong> info@uniquedetailing.ru</p>
<p><strong>Site:</strong> https://uniquedetailing.ru</p>
<p><strong>CRM:</strong> https://ops.uniquedetailing.ru</p>`,
  }),
});

const text = await res.text();
console.log(res.status, text);
if (!res.ok) process.exit(1);
