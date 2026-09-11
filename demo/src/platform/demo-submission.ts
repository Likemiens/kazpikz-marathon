import type { Distance, Language } from "../domain/content";
import type { FormValues } from "../domain/validation";

export type DemoSubmission = FormValues & {
  messageId: string;
  language: Language;
  distance: Distance;
};

export type DemoAck = {
  messageId: string;
  committedAt: string;
};

const pending = new Map<string, Promise<DemoAck>>();

export function createAttemptId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function submitDemoMessage({ messageId }: DemoSubmission): Promise<DemoAck> {
  const existing = pending.get(messageId);
  if (existing) return existing;

  const request = new Promise<DemoAck>((resolve) => {
    window.setTimeout(() => resolve({ messageId, committedAt: new Date().toISOString() }), 850);
  });
  pending.set(messageId, request);
  return request;
}
