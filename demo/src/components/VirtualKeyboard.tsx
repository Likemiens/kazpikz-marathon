import { ArrowRight, ArrowUp, Backspace } from "@phosphor-icons/react";
import type { Copy, Language } from "../domain/content";

const KEY_ROWS: Record<Language, string[][]> = {
  ru: [
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
    ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ё"],
  ],
  kk: [
    ["й", "ц", "у", "к", "е", "н", "г", "ғ", "ш", "щ", "з", "х"],
    ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "ә", "ө"],
    ["я", "ч", "с", "м", "и", "т", "і", "ң", "б", "ү", "ұ", "қ", "һ"],
  ],
  en: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ],
};

type Props = {
  mode: "text" | "phone";
  language: Language;
  shifted: boolean;
  copy: Copy["keyboard"];
  activeLabel: string;
  onInsert: (value: string) => void;
  onBackspace: () => void;
  onToggleShift: () => void;
  onSwitchLayout: () => void;
  onNext: () => void;
  onDone: () => void;
};

function KeyButton({ children, className = "", label, onPress }: { children: React.ReactNode; className?: string; label?: string; onPress: () => void }) {
  return (
    <button
      type="button"
      className={`keyboard-key ${className}`}
      aria-label={label}
      onPointerDown={(event) => event.preventDefault()}
      onClick={onPress}
    >
      {children}
    </button>
  );
}

export function VirtualKeyboard(props: Props) {
  const locale = props.language === "en" ? "en-US" : props.language === "kk" ? "kk-KZ" : "ru-RU";

  if (props.mode === "phone") {
    return (
      <section className="virtual-keyboard phone-keyboard" aria-label="Numeric on-screen keyboard">
        <div className="keyboard-caption"><span>{props.activeLabel}</span><span>123</span></div>
        <div className="number-grid">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "0"].map((key) => (
            <KeyButton key={key} onPress={() => props.onInsert(key)}>{key}</KeyButton>
          ))}
          <KeyButton label={props.copy.backspace} onPress={props.onBackspace}><Backspace size={28} weight="regular" aria-hidden /></KeyButton>
          <KeyButton className="key-action" onPress={props.onNext}>{props.copy.next}<ArrowRight size={24} aria-hidden /></KeyButton>
          <KeyButton className="key-primary" onPress={props.onDone}>{props.copy.done}</KeyButton>
        </div>
      </section>
    );
  }

  return (
    <section className="virtual-keyboard" aria-label="On-screen keyboard">
      <div className="keyboard-caption"><span>{props.activeLabel}</span><span>{props.language.toUpperCase()}</span></div>
      <div className="letter-rows">
        {KEY_ROWS[props.language].map((row, rowIndex) => (
          <div className="keyboard-row" key={`${props.language}-${rowIndex}`}>
            {row.map((key) => (
              <KeyButton key={key} onPress={() => props.onInsert(props.shifted ? key.toLocaleUpperCase(locale) : key)}>
                {props.shifted ? key.toLocaleUpperCase(locale) : key}
              </KeyButton>
            ))}
            {rowIndex === 2 && (
              <KeyButton label={props.copy.backspace} className="key-wide" onPress={props.onBackspace}>
                <Backspace size={28} weight="regular" aria-hidden />
              </KeyButton>
            )}
          </div>
        ))}
      </div>
      <div className="keyboard-row keyboard-controls">
        <KeyButton label={props.copy.shift} className={props.shifted ? "is-active" : ""} onPress={props.onToggleShift}>
          <ArrowUp size={26} weight={props.shifted ? "fill" : "regular"} aria-hidden />
        </KeyButton>
        <KeyButton className="key-wide" onPress={props.onSwitchLayout}>{props.copy.layout} · {props.language.toUpperCase()}</KeyButton>
        <KeyButton onPress={() => props.onInsert("-")}>—</KeyButton>
        <KeyButton className="key-space" onPress={() => props.onInsert(" ")}>{props.copy.space}</KeyButton>
        <KeyButton onPress={() => props.onInsert(", ")}>,</KeyButton>
        <KeyButton onPress={() => props.onInsert(".")}>.</KeyButton>
        <KeyButton className="key-action" onPress={props.onNext}>{props.copy.next}<ArrowRight size={24} aria-hidden /></KeyButton>
        <KeyButton className="key-primary" onPress={props.onDone}>{props.copy.done}</KeyButton>
      </div>
    </section>
  );
}
