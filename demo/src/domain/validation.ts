import type { Copy, FieldName } from "./content";

export type FormValues = {
  runnerName: string;
  wish: string;
  phone: string;
};

export type FormErrors = Partial<Record<FieldName, string>>;

export const EMPTY_FORM: FormValues = { runnerName: "", wish: "", phone: "" };

export function visibleLength(value: string): number {
  if (typeof Intl.Segmenter !== "function") return Array.from(value).length;
  return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value)).length;
}

export function normalizePhone(value: string): string {
  return value.replace(/[\s()\-]/g, "");
}

export function validateForm(values: FormValues, copy: Copy): FormErrors {
  const errors: FormErrors = {};
  const runnerName = values.runnerName.trim();
  const wish = values.wish.trim();
  const phone = normalizePhone(values.phone);

  if (!runnerName) errors.runnerName = copy.required;
  else if (visibleLength(runnerName) < 2 || visibleLength(runnerName) > 120) errors.runnerName = copy.nameLength;

  if (!wish) errors.wish = copy.required;
  else if (visibleLength(wish) > 200) errors.wish = copy.wishLength;

  if (!phone) errors.phone = copy.required;
  else if (!/^\+\d{10,15}$/.test(phone)) errors.phone = copy.phoneFormat;

  return errors;
}
