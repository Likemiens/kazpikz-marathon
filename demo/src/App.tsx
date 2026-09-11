import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check } from "@phosphor-icons/react";
import kvImage from "../../assets/brand/kv-original.png";
import { AppHeader } from "./components/AppHeader";
import { VirtualKeyboard } from "./components/VirtualKeyboard";
import { CONTENT, LANGUAGE_OPTIONS, PHRASES, type Distance, type FieldName, type Language } from "./domain/content";
import { EMPTY_FORM, validateForm, visibleLength, type FormErrors, type FormValues } from "./domain/validation";
import { createAttemptId, submitDemoMessage } from "./platform/demo-submission";

type Screen = "language" | "distance" | "form" | "saving" | "success";
type DialogState = { type: "reset" } | { type: "replace"; phrase: string } | null;
type InputElement = HTMLInputElement | HTMLTextAreaElement;

const FIELD_ORDER: FieldName[] = ["runnerName", "wish", "phone"];
const MAX_LENGTH: Record<FieldName, number> = { runnerName: 120, wish: 200, phone: 24 };

function previousGraphemeStart(value: string, caret: number): number {
  if (caret <= 0) return 0;
  if (typeof Intl.Segmenter !== "function") return Math.max(0, caret - 1);
  const boundaries = Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value), ({ index }) => index);
  let previous = 0;
  for (const boundary of boundaries) {
    if (boundary >= caret) break;
    previous = boundary;
  }
  return previous;
}

function truncateGraphemes(value: string, max: number): string {
  if (visibleLength(value) <= max) return value;
  if (typeof Intl.Segmenter !== "function") return Array.from(value).slice(0, max).join("");
  return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value), ({ segment }) => segment).slice(0, max).join("");
}

function Dialog({ title, body, confirmLabel, cancelLabel, onConfirm, onCancel }: { title: string; body: string; confirmLabel: string; cancelLabel: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="dialog-backdrop" role="presentation" onPointerDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <p className="eyebrow">Almaty Marathon</p>
        <h2 id="dialog-title">{title}</h2>
        <p>{body}</p>
        <div className="dialog-actions">
          <button type="button" className="button button-secondary" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="button button-primary" autoFocus onClick={onConfirm}>{confirmLabel}<ArrowUpRight size={24} aria-hidden /></button>
        </div>
      </section>
    </div>
  );
}

function DemoNotice({ children }: { children: React.ReactNode }) {
  return <div className="demo-notice">{children}</div>;
}

export function App() {
  const [screen, setScreen] = useState<Screen>("language");
  const [language, setLanguage] = useState<Language | null>(null);
  const [keyboardLanguage, setKeyboardLanguage] = useState<Language>("ru");
  const [distance, setDistance] = useState<Distance | null>(null);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeField, setActiveField] = useState<FieldName>("runnerName");
  const [shifted, setShifted] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState(() => Date.now());
  const [idleSeconds, setIdleSeconds] = useState<number | null>(null);

  const runnerNameRef = useRef<HTMLInputElement>(null);
  const wishRef = useRef<HTMLTextAreaElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const refs: Record<FieldName, React.RefObject<InputElement | null>> = {
    runnerName: runnerNameRef,
    wish: wishRef,
    phone: phoneRef,
  };

  const copy = CONTENT[language ?? "ru"];

  const resetToStart = useCallback(() => {
    setForm(EMPTY_FORM);
    setErrors({});
    setLanguage(null);
    setDistance(null);
    setAttemptId(null);
    setDialog(null);
    setIdleSeconds(null);
    setActiveField("runnerName");
    setScreen("language");
  }, []);

  const markActivity = useCallback(() => {
    if (screen === "form") {
      setLastActivity(Date.now());
      setIdleSeconds(null);
    }
  }, [screen]);

  useEffect(() => {
    document.documentElement.lang = language ?? "ru";
  }, [language]);

  useEffect(() => {
    if (screen !== "success") return;
    const timer = window.setTimeout(resetToStart, 4000);
    return () => window.clearTimeout(timer);
  }, [screen, resetToStart]);

  useEffect(() => {
    if (screen !== "form") return;
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivity) / 1000);
      if (elapsed >= 105) resetToStart();
      else if (elapsed >= 90) setIdleSeconds(105 - elapsed);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lastActivity, resetToStart, screen]);

  const activeLabel = useMemo(() => ({ runnerName: copy.runnerName, wish: copy.wish, phone: copy.phone })[activeField], [activeField, copy]);

  function focusField(field: FieldName, caret?: number) {
    setActiveField(field);
    window.requestAnimationFrame(() => {
      const element = refs[field].current;
      element?.focus({ preventScroll: true });
      if (caret !== undefined) element?.setSelectionRange(caret, caret);
    });
  }

  function updateField(field: FieldName, nextValue: string, caret?: number) {
    const value = truncateGraphemes(nextValue, MAX_LENGTH[field]);
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    focusField(field, caret === undefined ? undefined : Math.min(caret, value.length));
  }

  function insertAtCaret(value: string) {
    const element = refs[activeField].current;
    const current = form[activeField];
    const start = element?.selectionStart ?? current.length;
    const end = element?.selectionEnd ?? start;
    updateField(activeField, `${current.slice(0, start)}${value}${current.slice(end)}`, start + value.length);
    setShifted(false);
  }

  function deleteAtCaret() {
    const element = refs[activeField].current;
    const current = form[activeField];
    const start = element?.selectionStart ?? current.length;
    const end = element?.selectionEnd ?? start;
    if (start !== end) updateField(activeField, `${current.slice(0, start)}${current.slice(end)}`, start);
    else if (start > 0) {
      const previous = previousGraphemeStart(current, start);
      updateField(activeField, `${current.slice(0, previous)}${current.slice(start)}`, previous);
    }
  }

  function selectLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    setKeyboardLanguage(nextLanguage);
    setScreen("distance");
  }

  function selectDistance(nextDistance: Distance) {
    setDistance(nextDistance);
    setLastActivity(Date.now());
    setScreen("form");
    window.setTimeout(() => focusField("runnerName"), 50);
  }

  function advanceField() {
    const index = FIELD_ORDER.indexOf(activeField);
    if (index < FIELD_ORDER.length - 1) focusField(FIELD_ORDER[index + 1]);
    else refs[activeField].current?.blur();
  }

  function applyPhrase(phrase: string) {
    if (form.wish.trim() && form.wish !== phrase) setDialog({ type: "replace", phrase });
    else updateField("wish", phrase, phrase.length);
  }

  async function submitForm() {
    if (!language || !distance || screen !== "form") return;
    const nextErrors = validateForm(form, copy);
    setErrors(nextErrors);
    const firstError = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstError) {
      focusField(firstError);
      return;
    }

    const messageId = attemptId ?? createAttemptId();
    setAttemptId(messageId);
    setScreen("saving");
    await submitDemoMessage({ ...form, messageId, language, distance });
    setForm(EMPTY_FORM);
    setErrors({});
    setAttemptId(null);
    setScreen("success");
  }

  if (screen === "language") {
    return (
      <main className="prototype-stage">
        <section className="app-frame app-screen language-screen" aria-labelledby="welcome-title">
          <div className="language-visual">
            <div className="kv-frame"><img src={kvImage} alt="Kaspi.kz and Almaty Marathon runners on a track" /></div>
            <div className="visual-footer"><strong>ALMATY MARATHON</strong><strong>EXPO · 25—26 / 09</strong></div>
          </div>
          <div className="language-panel">
            <p className="eyebrow">СӨЗБЕН ҚОЛДАУ / СЛОВА ПОДДЕРЖКИ</p>
            <h1 id="welcome-title">ТВОИ СЛОВА<br />ПОМОГУТ<br />ДОБЕЖАТЬ</h1>
            <p className="lead">Оставь пожелание участнику марафона. Его могут включить в ролик поддержки.</p>
            <div className="language-options">
              {LANGUAGE_OPTIONS.map((option) => (
                <button type="button" key={option.code} className="language-button" onClick={() => selectLanguage(option.code)}>
                  <span>{option.label}</span><ArrowUpRight size={36} weight="bold" aria-hidden />
                </button>
              ))}
            </div>
            <p className="language-hint">Тілді таңдаңыз · Выберите язык · Choose a language</p>
          </div>
          <DemoNotice>UX-ДЕМО · ТОЛЬКО ТЕСТОВЫЕ ДАННЫЕ</DemoNotice>
        </section>
      </main>
    );
  }

  if (screen === "distance" && language) {
    return (
      <main className="prototype-stage">
        <section className="app-frame app-screen distance-screen" aria-labelledby="distance-title">
          <AppHeader />
          <div className="distance-content">
            <div className="distance-copy">
              <button type="button" className="back-button on-dark" onClick={() => setScreen("language")}><ArrowLeft size={24} aria-hidden />{copy.back}</button>
              <p className="step-label">01 / 02</p>
              <h1 id="distance-title">{copy.distanceTitle}</h1>
              <p>{copy.intro}</p>
            </div>
            <div className="distance-options">
              {([10, 21, 42] as Distance[]).map((option) => (
                <button type="button" key={option} className="distance-card" onClick={() => selectDistance(option)}>
                  <span className="distance-number">{option}</span><span className="distance-unit">{language === "en" ? "KM" : "КМ"}</span><ArrowUpRight size={42} weight="bold" aria-hidden />
                </button>
              ))}
            </div>
          </div>
          <DemoNotice>{copy.demoNotice}</DemoNotice>
        </section>
      </main>
    );
  }

  if (screen === "saving" && language) {
    return (
      <main className="prototype-stage">
        <section className="app-frame app-screen saving-screen" aria-live="polite">
          <div className="saving-indicator" aria-hidden><span /><span /><span /></div>
          <h1>{copy.savingTitle}</h1>
          <p>{copy.savingHint}</p>
          <DemoNotice>{copy.demoNotice}</DemoNotice>
        </section>
      </main>
    );
  }

  if (screen === "success" && language) {
    return (
      <main className="prototype-stage">
        <section className="app-frame app-screen success-screen" aria-labelledby="success-title">
          <div className="success-mark"><Check size={56} weight="bold" aria-hidden /></div>
          <div className="success-copy">
            <h1 id="success-title">{copy.successTitle}</h1>
            <p>{copy.successBody}</p>
            <button type="button" className="button success-button" onClick={resetToStart}>{copy.home}<ArrowUpRight size={24} weight="bold" aria-hidden /></button>
          </div>
          <DemoNotice>{copy.demoNotice}</DemoNotice>
        </section>
      </main>
    );
  }

  if (!language || !distance) return null;

  const keyboardMode = activeField === "phone" ? "phone" : "text";
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <main className="prototype-stage" onPointerDownCapture={markActivity} onKeyDownCapture={markActivity}>
      <section className="app-frame app-screen form-screen" aria-labelledby="form-title">
        <AppHeader />
        <form className="message-form" onSubmit={(event) => { event.preventDefault(); void submitForm(); }} noValidate>
          <div className="form-toolbar">
            <button type="button" className="back-button" onClick={() => setScreen("distance")}><ArrowLeft size={24} aria-hidden />{copy.back}</button>
            <h1 id="form-title">{copy.formTitle}</h1>
            <button type="button" className="distance-chip" onClick={() => setScreen("distance")}>{distance} {language === "en" ? "km" : "км"}<ArrowUpRight size={22} weight="bold" aria-hidden /></button>
          </div>

          {hasErrors && <div className="error-summary" role="alert">{copy.fixFields}</div>}

          <div className="form-grid">
            <div className="form-column">
              <label className={`field ${activeField === "runnerName" ? "is-active" : ""} ${errors.runnerName ? "has-error" : ""}`}>
                <span>{copy.runnerName}</span>
                <input ref={runnerNameRef} value={form.runnerName} onFocus={() => setActiveField("runnerName")} onChange={(event) => updateField("runnerName", event.target.value)} placeholder={copy.runnerNamePlaceholder} inputMode="none" autoComplete="off" spellCheck={false} aria-invalid={Boolean(errors.runnerName)} />
                {errors.runnerName && <small role="alert">{errors.runnerName}</small>}
              </label>

              <label className={`field ${activeField === "phone" ? "is-active" : ""} ${errors.phone ? "has-error" : ""}`}>
                <span>{copy.phone}</span>
                <input ref={phoneRef} value={form.phone} onFocus={() => setActiveField("phone")} onChange={(event) => updateField("phone", event.target.value)} placeholder={copy.phonePlaceholder} inputMode="none" autoComplete="off" spellCheck={false} aria-invalid={Boolean(errors.phone)} />
                {errors.phone ? <small role="alert">{errors.phone}</small> : <small>{copy.phoneHint}</small>}
              </label>

              <div className="form-notes">
                <strong>{copy.requiredHint}</strong>
                <span>{copy.privacyDraft}</span>
                <button type="button" className="text-button" onClick={() => setDialog({ type: "reset" })}>{copy.startOver}</button>
              </div>
            </div>

            <div className="form-column wish-column">
              <label className={`field field-wish ${activeField === "wish" ? "is-active" : ""} ${errors.wish ? "has-error" : ""}`}>
                <span className="label-row"><span>{copy.wish}</span><span>{visibleLength(form.wish)} / 200</span></span>
                <textarea ref={wishRef} value={form.wish} onFocus={() => setActiveField("wish")} onChange={(event) => updateField("wish", event.target.value)} placeholder={copy.wishPlaceholder} inputMode="none" autoComplete="off" spellCheck={false} aria-invalid={Boolean(errors.wish)} />
                {errors.wish && <small role="alert">{errors.wish}</small>}
              </label>
              <p className="phrase-label">{copy.readyPhrases}</p>
              <div className="phrase-grid">
                {PHRASES[language].map((phrase) => (
                  <button type="button" key={phrase} className={`phrase-button ${form.wish === phrase ? "is-selected" : ""}`} onClick={() => applyPhrase(phrase)}>{phrase}</button>
                ))}
              </div>
              <button type="submit" className="button button-primary submit-button">{copy.submit}<ArrowUpRight size={26} weight="bold" aria-hidden /></button>
            </div>
          </div>

          <VirtualKeyboard
            mode={keyboardMode}
            language={keyboardLanguage}
            shifted={shifted}
            copy={copy.keyboard}
            activeLabel={activeLabel}
            onInsert={insertAtCaret}
            onBackspace={deleteAtCaret}
            onToggleShift={() => setShifted((current) => !current)}
            onSwitchLayout={() => setKeyboardLanguage((current) => current === "kk" ? "ru" : current === "ru" ? "en" : "kk")}
            onNext={advanceField}
            onDone={() => refs[activeField].current?.blur()}
          />
        </form>

        <DemoNotice>{copy.demoNotice}</DemoNotice>

        {dialog?.type === "reset" && <Dialog title={copy.resetTitle} body={copy.resetBody} confirmLabel={copy.resetConfirm} cancelLabel={copy.cancel} onCancel={() => setDialog(null)} onConfirm={resetToStart} />}
        {dialog?.type === "replace" && <Dialog title={copy.replaceTitle} body={copy.replaceBody} confirmLabel={copy.replaceConfirm} cancelLabel={copy.cancel} onCancel={() => setDialog(null)} onConfirm={() => { updateField("wish", dialog.phrase, dialog.phrase.length); setDialog(null); }} />}
        {idleSeconds !== null && <Dialog title={copy.idleTitle} body={copy.idleBody(idleSeconds)} confirmLabel={copy.continue} cancelLabel={copy.startOver} onCancel={resetToStart} onConfirm={() => { setLastActivity(Date.now()); setIdleSeconds(null); }} />}
      </section>
    </main>
  );
}
