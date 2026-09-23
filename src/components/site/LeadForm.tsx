import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SERVICE_GROUPS, SERVICES } from "@/lib/services";
import { isSupabaseConfigured, submitLead } from "@/lib/supabase";

const CONTACT_EMAIL = "info@uniquedetailing.ru";

function buildMailto(v: Record<string, string>) {
  const lines = [
    `Имя: ${v.name}`,
    `Телефон: ${v.phone}`,
    v.email && `Email: ${v.email}`,
    v.car && `Автомобиль: ${v.car}`,
    v.service && `Услуга: ${v.service}`,
    v.comment && `Комментарий: ${v.comment}`,
  ].filter(Boolean);
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Заявка с сайта UNIQUE Detailing")}&body=${encodeURIComponent(lines.join("\n"))}`;
}

/**
 * Booking / request form used on /kontakty and on every service page.
 * Submits to Supabase (`submit_website_lead`). If the backend is not
 * configured or fails, the visitor gets a ready-to-send e-mail fallback so
 * the request is never lost.
 */
export function LeadForm({
  defaultService,
  heading = "Оставьте заявку",
  eyebrow = "Рассчитать стоимость",
}: {
  defaultService?: string;
  heading?: string;
  eyebrow?: string;
}) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [consentData, setConsentData] = useState(false);
  const [consentPolicy, setConsentPolicy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      car: String(fd.get("car") ?? "").trim(),
      service: String(fd.get("service") ?? "").trim(),
      comment: String(fd.get("comment") ?? "").trim(),
    };
    setMailto(null);
    if (!values.name || !values.phone) {
      setError("Укажите имя и телефон — так мы сможем связаться с вами.");
      return;
    }
    if (!consentData || !consentPolicy) {
      setError(
        "Отметьте согласие на обработку персональных данных и ознакомление с политикой конфиденциальности.",
      );
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = isSupabaseConfigured
        ? await submitLead(values)
        : ({ ok: false, error: "supabase_not_configured" } as const);
      if (!result.ok) {
        setMailto(buildMailto(values));
        setError(
          `Не удалось отправить заявку автоматически. Нажмите «Отправить по почте» — письмо откроется уже заполненным, или напишите нам на ${CONTACT_EMAIL}.`,
        );
        return;
      }
      setSent(true);
    } catch {
      setMailto(buildMailto(values));
      setError(
        `Не удалось отправить заявку автоматически. Нажмите «Отправить по почте» или напишите нам на ${CONTACT_EMAIL}.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      id="zapis"
      className="scroll-mt-28 space-y-8 border border-line bg-obsidian-2 p-8 md:p-10"
    >
      {sent ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <p className="eyebrow mb-6">Заявка принята</p>
          <p
            className="font-display text-3xl uppercase text-ivory"
            style={{ letterSpacing: "0.05em" }}
          >
            Спасибо!
          </p>
          <p className="mt-6 max-w-[440px] text-[15px] leading-[1.85] text-mute">
            Наш менеджер свяжется с вами в течение часа, чтобы уточнить детали и рассчитать
            стоимость.
          </p>
        </div>
      ) : (
        <>
          <div>
            <p className="eyebrow mb-2">{eyebrow}</p>
            <h2
              className="font-display text-3xl uppercase text-ivory"
              style={{ letterSpacing: "0.05em" }}
            >
              {heading}
            </h2>
          </div>

          {[
            ["Ваше имя", "name", "text", true],
            ["Телефон", "phone", "tel", true],
            ["Email", "email", "email", false],
            ["Марка и модель авто", "car", "text", false],
          ].map(([label, name, type, required]) => (
            <div key={String(name)}>
              <label
                htmlFor={`lead-${name}`}
                className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-mute-2"
              >
                {label}
                {required ? <span className="text-ember"> *</span> : null}
              </label>
              <input
                id={`lead-${name}`}
                name={String(name)}
                type={String(type)}
                required={Boolean(required)}
                autoComplete={
                  name === "name"
                    ? "name"
                    : name === "phone"
                      ? "tel"
                      : name === "email"
                        ? "email"
                        : "off"
                }
                className="w-full border-b border-line bg-transparent p-3 text-ivory outline-none focus:border-ivory"
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="lead-service"
              className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-mute-2"
            >
              Интересующая услуга
            </label>
            <select
              id="lead-service"
              name="service"
              defaultValue={defaultService ?? ""}
              className="w-full border border-line bg-transparent p-4 text-ivory outline-none focus:border-ivory"
            >
              <option value="" className="bg-obsidian">
                Выберите услугу
              </option>
              {SERVICE_GROUPS.map((g) => (
                <optgroup key={g.id} label={g.title} className="bg-obsidian">
                  {SERVICES.filter((s) => s.group === g.id).map((s) => (
                    <option key={s.slug} value={s.title} className="bg-obsidian">
                      {s.title}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="Комплекс услуг" className="bg-obsidian">
                Комплекс услуг
              </option>
              <option value="Другое" className="bg-obsidian">
                Другое
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="lead-comment"
              className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-mute-2"
            >
              Комментарий
            </label>
            <textarea
              id="lead-comment"
              name="comment"
              rows={5}
              className="w-full border border-line bg-transparent p-4 text-ivory outline-none focus:border-ivory"
              placeholder="Опишите пожелания или задайте вопрос"
            />
          </div>

          {error ? (
            <div
              className="space-y-3 border border-ember/40 bg-ember/10 px-4 py-3 text-[13px] leading-[1.7] text-ivory"
              role="alert"
            >
              <p>{error}</p>
              {mailto ? (
                <a href={mailto} className="btn-line inline-block">
                  Отправить по почте
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-[12.5px] leading-[1.6] text-mute">
              <input
                type="checkbox"
                required
                checked={consentData}
                onChange={(e) => setConsentData(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-ember"
              />
              <span>
                Даю согласие на{" "}
                <Link
                  to="/politika"
                  hash="consent"
                  className="text-mute underline-offset-2 hover:text-ivory hover:underline"
                >
                  обработку персональных данных
                </Link>
                .<span className="text-ember"> *</span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-[12.5px] leading-[1.6] text-mute">
              <input
                type="checkbox"
                required
                checked={consentPolicy}
                onChange={(e) => setConsentPolicy(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-ember"
              />
              <span>
                Ознакомлен(а) и согласен(на) с{" "}
                <Link
                  to="/politika"
                  className="text-mute underline-offset-2 hover:text-ivory hover:underline"
                >
                  политикой конфиденциальности
                </Link>
                .<span className="text-ember"> *</span>
              </span>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4">
            <button type="submit" className="btn-line btn-ember" disabled={submitting}>
              {submitting ? "Отправляем…" : "Отправить заявку"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
