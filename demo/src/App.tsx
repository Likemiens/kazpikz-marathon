import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react";
import kvLandscapeWide from "../../assets/brand/kv-landscape-wide-v1.png";
import { AppHeader } from "./components/AppHeader";
import { VirtualKeyboard } from "./components/VirtualKeyboard";
import { CONTENT, LANGUAGE_OPTIONS, PHRASES, type Distance, type FieldName, type Language } from "./domain/content";
import { EMPTY_FORM, validateForm, visibleLength, type FormErrors, type FormValues } from "./domain/validation";
import { createAttemptId, submitDemoMessage } from "./platform/demo-submission";

type Screen = "language" | "distance" | "form" | "saving" | "success";
type DialogState = { type: "reset" } | { type: "replace"; phrase: string } | null;
type InputElement = HTMLInputElement | HTMLTextAreaElement;
type SubmittedMessage = Pick<FormValues, "runnerName" | "wish"> & { distance: Distance };

const FIELD_ORDER: FieldName[] = ["runnerName", "phone", "wish"];
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
        <h2 id="dialog-title">{title}</h2>
        <p>{body}</p>
        <div className="dialog-actions">
          <button type="button" className="button button-secondary" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="button button-primary" autoFocus onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}

function PhraseSheet({ title, closeLabel, phrases, selectedPhrase, onSelect, onClose }: { title: string; closeLabel: string; phrases: string[]; selectedPhrase: string; onSelect: (phrase: string) => void; onClose: () => void }) {
  return (
    <div className="phrase-sheet-backdrop" role="presentation" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="phrase-sheet" role="dialog" aria-modal="true" aria-labelledby="phrase-sheet-title">
        <div className="phrase-sheet-header">
          <div>
            <h2 id="phrase-sheet-title">{title}</h2>
          </div>
          <button type="button" className="sheet-close" autoFocus onClick={onClose}>{closeLabel}</button>
        </div>
        <div className="phrase-sheet-grid">
          {phrases.map((phrase) => (
            <button type="button" key={phrase} className={`phrase-sheet-option ${selectedPhrase === phrase ? "is-selected" : ""}`} onClick={() => onSelect(phrase)}>{phrase}</button>
          ))}
        </div>
      </section>
    </div>
  );
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
  const [phraseSheetOpen, setPhraseSheetOpen] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<SubmittedMessage | null>(null);
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
    setSubmittedMessage(null);
    setDialog(null);
    setPhraseSheetOpen(false);
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
    const timer = window.setTimeout(resetToStart, 8000);
    return () => window.clearTimeout(timer);
  }, [screen, resetToStart]);

  useEffect(() => {
    if (screen !== "form") return;
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivity) / 1000);
      if (elapsed >= 105) resetToStart();
      else if (elapsed >= 90) {
        setPhraseSheetOpen(false);
        setIdleSeconds(105 - elapsed);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lastActivity, resetToStart, screen]);

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
    setPhraseSheetOpen(false);
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
    setSubmittedMessage({ runnerName: form.runnerName.trim(), wish: form.wish.trim(), distance });
    setForm(EMPTY_FORM);
    setErrors({});
    setAttemptId(null);
    setScreen("success");
  }

  if (screen === "language") {
    return (
      <main className="prototype-stage">
        <section className="app-frame app-screen language-screen" aria-labelledby="welcome-title">
          <img className="language-background" src={kvLandscapeWide} alt="Kaspi.kz и Almaty Marathon. 10 жыл қарқынды ұстап келеміз." />
          <div className="language-content">
            <h1 id="welcome-title" className="visually-hidden">Твои слова помогут добежать</h1>
            <div className="welcome-action-panel">
              <p className="welcome-cta">Оставь пожелание участнику марафона, и 27 сентября оно появится на городских экранах.</p>
              <div className="language-picker">
                <p>Выбери язык</p>
                <div className="language-options">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button type="button" key={option.code} className="language-button" onClick={() => selectLanguage(option.code)}>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "distance" && language) {
    return (
      <main className="prototype-stage">
        <section className="app-frame app-screen distance-screen" aria-labelledby="distance-title">
          <AppHeader eventName={copy.eventName} />
          <div className="distance-content">
            <div className="distance-copy">
              <button type="button" className="back-button on-dark" onClick={() => setScreen("language")}>{copy.back}</button>
              <h1 id="distance-title">{copy.distanceTitle}</h1>
            </div>
            <div className="distance-options">
              {([10, 21, 42] as Distance[]).map((option) => (
                <button type="button" key={option} className="distance-card" onClick={() => selectDistance(option)}>
                  <span className="distance-number">{option}</span><span className="distance-unit">{language === "en" ? "KM" : "КМ"}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "saving" && language) {
    return (
      <main className="prototype-stage">
        <section className="app-frame app-screen saving-screen" aria-live="polite">
          <AppHeader eventName={copy.eventName} />
          <div className="saving-body">
            <div className="saving-indicator" aria-hidden><span /><span /><span /></div>
            <h1>{copy.savingTitle}</h1>
            <p>{copy.savingHint}</p>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "success" && language && submittedMessage) {
    return (
      <main className="prototype-stage">
        <section className="app-frame app-screen success-screen" aria-labelledby="success-title">
          <AppHeader eventName={copy.eventName} />
          <div className="success-body">
            <div className="success-copy">
              <div className="success-mark"><Check size={34} weight="bold" aria-hidden /></div>
              <strong>{copy.successTitle}</strong>
              <span>{copy.successBody}</span>
            </div>
            <div className="wish-display">
              <p className="wish-display-label">{copy.messageFor}</p>
              <h1 id="success-title">{submittedMessage.runnerName}</h1>
              <blockquote>«{submittedMessage.wish}»</blockquote>
              <span className="wish-distance">{submittedMessage.distance} {language === "en" ? "km" : "км"}</span>
            </div>
            <button type="button" className="button success-button" onClick={resetToStart}>{copy.home}</button>
          </div>
        </section>
      </main>
    );
  }

  if (!language || !distance) return null;

  const keyboardMode = activeField === "phone" ? "phone" : "text";
  return (
    <main className="prototype-stage" onPointerDownCapture={markActivity} onKeyDownCapture={markActivity}>
      <section className="app-frame app-screen form-screen" aria-labelledby="form-title">
        <AppHeader eventName={copy.eventName} />
        <form className="message-form" onSubmit={(event) => { event.preventDefault(); void submitForm(); }} noValidate>
          <div className="form-toolbar">
            <button type="button" className="back-button" onClick={() => setScreen("distance")}>{copy.back}</button>
            <h1 id="form-title">
              <span>{copy.formTitle}</span>
              <span className="form-title-distance"> · {distance} {language === "en" ? "km" : "км"}</span>
            </h1>
          </div>

          <div className="form-surface">
            <div className="form-fields">
              <label className={`field ${activeField === "runnerName" ? "is-active" : ""} ${errors.runnerName ? "has-error" : ""}`}>
                <span>{copy.runnerName}</span>
                <input ref={runnerNameRef} value={form.runnerName} onFocus={() => setActiveField("runnerName")} onChange={(event) => updateField("runnerName", event.target.value)} placeholder={copy.runnerNamePlaceholder} inputMode="none" autoComplete="off" spellCheck={false} aria-invalid={Boolean(errors.runnerName)} />
                {errors.runnerName ? (
                  <small role="alert">{errors.runnerName}</small>
                ) : (
                  <small className="field-support-placeholder" aria-hidden>
                    &nbsp;
                  </small>
                )}
              </label>

              <label className={`field ${activeField === "phone" ? "is-active" : ""} ${errors.phone ? "has-error" : ""}`}>
                <span>{copy.phone}</span>
                <input ref={phoneRef} value={form.phone} onFocus={() => setActiveField("phone")} onChange={(event) => updateField("phone", event.target.value)} placeholder={copy.phonePlaceholder} inputMode="none" autoComplete="off" spellCheck={false} aria-invalid={Boolean(errors.phone)} />
                {errors.phone ? (
                  <small role="alert">{errors.phone}</small>
                ) : (
                  <small className="field-support-placeholder" aria-hidden>
                    &nbsp;
                  </small>
                )}
              </label>
            </div>

            <div className="wish-area">
              <label className={`field field-wish ${activeField === "wish" ? "is-active" : ""} ${errors.wish ? "has-error" : ""}`}>
                <span className="label-row"><span>{copy.wish}</span><span>{visibleLength(form.wish)} / 200</span></span>
                <textarea ref={wishRef} value={form.wish} onFocus={() => setActiveField("wish")} onChange={(event) => updateField("wish", event.target.value)} placeholder={copy.wishPlaceholder} inputMode="none" autoComplete="off" spellCheck={false} aria-invalid={Boolean(errors.wish)} />
                {errors.wish && <small role="alert">{errors.wish}</small>}
              </label>
              <p className="phrase-label">{copy.readyPhrases}</p>
              <div className="phrase-grid">
                {PHRASES[language].slice(0, 6).map((phrase) => (
                  <button type="button" key={phrase} className={`phrase-button ${form.wish === phrase ? "is-selected" : ""}`} onClick={() => applyPhrase(phrase)}>{phrase}</button>
                ))}
                <button type="button" className="phrase-button phrase-more" onClick={() => setPhraseSheetOpen(true)}>{copy.allPhrases}</button>
              </div>
            </div>
            <button type="submit" className="button button-primary submit-button">{copy.submit}</button>
          </div>

          <VirtualKeyboard
            mode={keyboardMode}
            language={keyboardLanguage}
            shifted={shifted}
            copy={copy.keyboard}
            onInsert={insertAtCaret}
            onBackspace={deleteAtCaret}
            onToggleShift={() => setShifted((current) => !current)}
            onSwitchLayout={() => setKeyboardLanguage((current) => current === "kk" ? "ru" : current === "ru" ? "en" : "kk")}
            onNext={advanceField}
            onDone={() => refs[activeField].current?.blur()}
          />
        </form>

        {dialog?.type === "reset" && <Dialog title={copy.resetTitle} body={copy.resetBody} confirmLabel={copy.resetConfirm} cancelLabel={copy.cancel} onCancel={() => setDialog(null)} onConfirm={resetToStart} />}
        {dialog?.type === "replace" && <Dialog title={copy.replaceTitle} body={copy.replaceBody} confirmLabel={copy.replaceConfirm} cancelLabel={copy.cancel} onCancel={() => setDialog(null)} onConfirm={() => { updateField("wish", dialog.phrase, dialog.phrase.length); setDialog(null); }} />}
        {idleSeconds !== null && <Dialog title={copy.idleTitle} body={copy.idleBody(idleSeconds)} confirmLabel={copy.continue} cancelLabel={copy.startOver} onCancel={resetToStart} onConfirm={() => { setLastActivity(Date.now()); setIdleSeconds(null); }} />}
        {phraseSheetOpen && <PhraseSheet title={copy.phrasesTitle} closeLabel={copy.close} phrases={PHRASES[language]} selectedPhrase={form.wish} onSelect={applyPhrase} onClose={() => setPhraseSheetOpen(false)} />}
      </section>
    </main>
  );
}
