/** Android native bridge CONTRACT v2, not a plugin implementation.
 * Native enforces limits/auth on every privileged call. No executeSql/readFile.
 * Spec uses snake_case for payloads to match schema/export, not UI field names.
 */
export type Language = 'kk' | 'ru' | 'en';
export type DistanceKm = 10 | 21 | 42;
export type FilterStatus = 'not_checked' | 'clear' | 'flagged';
export type UUID = string;
export type OperatorToken = string; // memory-only, unpredictable, expiry native-side
export type NativeErrorCode =
  | 'VALIDATION' | 'ID_CONFLICT' | 'STORAGE_FULL' | 'STORAGE_READONLY'
  | 'STORAGE_BUSY' | 'STORAGE_CORRUPT' | 'UNAUTHORIZED' | 'RATE_LIMITED'
  | 'NATIVE_UNAVAILABLE' | 'OPERATION_PENDING' | 'OPERATION_EXPIRED'
  | 'EXPORT_CANCELLED' | 'EXPORT_NOT_VERIFIED' | 'USB_UNAVAILABLE';
export type Result<T> = { ok: true; value: T } |
  { ok: false; error: { code: NativeErrorCode; retryable: boolean } };
export interface MessageInput {
  message_id: UUID;
  language: Language;
  distance_km: DistanceKm;
  runner_name: string;
  wish_text: string;
  phone_raw: string;
  selected_phrase_id: string | null;
  template_modified: boolean;
  privacy_notice_version: string | null;
  /** Restricted structure approved in privacy config, not arbitrary executable text. */
  privacy_evidence: { notice_shown: boolean; consent_checked: boolean | null } | null;
}
export interface Receipt {
  message_id: UUID;
  created_at_utc: string;
  result: 'created' | 'already_saved';
}
export interface ExportRow {
  message_id: UUID;
  distance_km: DistanceKm;
  language: Language;
  runner_name: string;
  wish_text: string;
  phone_normalized: string; // only available with valid operator capability
  created_at_utc: string;
  created_at_local: string;
  device_id: string;
  filter_status: FilterStatus;
  filter_version: string | null;
}
export type ExportFile = 'all.xlsx' | '10km.xlsx' | '21km.xlsx' | '42km.xlsx' | 'moderation.xlsx';
export interface ExportSnapshot {
  operation_id: UUID;
  snapshot_id: UUID;
  batch_id: UUID;
  snapshot_utc: string;
  counts: { all: number; km10: number; km21: number; km42: number };
}
export interface NativeBridge {
  getPublicConfig(): Promise<Result<{
    native_ready: boolean; collection_allowed: boolean; languages: Language[];
    distances: DistanceKm[]; ready_phrases: boolean;
  }>>;
  submitMessage(input: MessageInput): Promise<Result<Receipt>>;
  getSubmissionStatus(input: { message_id: UUID }): Promise<Result<{
    state: 'PENDING' | 'SAVED' | 'NOT_FOUND' | 'FAILED'; receipt?: Receipt;
  }>>; // NOT_FOUND only after native queue knows no operation remains pending.
  unlockOperator(input: { pin: string }): Promise<Result<{ token: OperatorToken; expires_at: string }>>;
  lockOperator(input: { token: OperatorToken }): Promise<Result<{ locked: true }>>;
  getDiagnostics(input: { token: OperatorToken }): Promise<Result<{
    app_version: string; device_id: string; android_api: number; webview_version: string;
    sqlite_version: string; journal_mode: string; synchronous: number;
    record_count: number; last_backup_utc: string | null; last_error_code: string | null;
  }>>;
  createLocalBackup(input: { token: OperatorToken }): Promise<Result<{ snapshot_id: UUID; verified: true }>>;
  beginExport(input: { token: OperatorToken }): Promise<Result<ExportSnapshot>>;
  readExportPage(input: { token: OperatorToken; operation_id: UUID; offset: number; limit: number }):
    Promise<Result<{ rows: ExportRow[]; next_offset: number | null }>>; // limit 1..250
  appendExportChunk(input: {
    token: OperatorToken; operation_id: UUID; file: ExportFile;
    chunk_index: number; base64: string; is_last: boolean;
  }): Promise<Result<{ accepted_index: number }>>; // <=256 KiB decoded; native enforces order/quotas
  sealExport(input: { token: OperatorToken; operation_id: UUID }):
    Promise<Result<{ operation_id: UUID; byte_length: number; sha256: string }>>;
  saveExportToDocument(input: { token: OperatorToken; operation_id: UUID }):
    Promise<Result<{ operation_id: UUID; verified: true; sha256: string; display_name: string }>>;
  createExternalBackup(input: { token: OperatorToken }):
    Promise<Result<{ operation_id: UUID; verified: true; sha256: string; display_name: string }>>;
}

// Initial PIN provisioning is a local preparation step, never a public resetPin
// method. Production cannot fall back to a web implementation of storage/export.
// sealExport native builds manifest and ZIP, not arbitrary JSON supplied by UI.
// Both save methods launch SAF internally. Raw filesystem paths/URI are not inputs.
