-- Android v2 proposal: DELETE/EXTRA; SQLiteOpenHelper onCreate already manages
-- its DDL transaction. Do not execute this whole reference BEGIN/COMMIT script
-- inside onCreate. Configure/read connection PRAGMAs in the native lifecycle.
-- Proposed schema v1. Contract, not a complete application migration system.
-- Apply only to a NEW database; do not recreate an existing failed database.
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = DELETE;
PRAGMA synchronous = EXTRA;
PRAGMA busy_timeout = 5000;
BEGIN;
CREATE TABLE app_meta (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
);
CREATE TABLE messages (
    message_id TEXT PRIMARY KEY NOT NULL CHECK(length(message_id) = 36),
    device_id TEXT NOT NULL CHECK(length(trim(device_id)) > 0),
    language TEXT NOT NULL CHECK(language IN ('kk', 'ru', 'en')),
    distance_km INTEGER NOT NULL CHECK(distance_km IN (10, 21, 42)),
    runner_name TEXT NOT NULL CHECK(length(trim(runner_name)) > 0),
    wish_text TEXT NOT NULL CHECK(length(trim(wish_text)) > 0),
    phone_raw TEXT NOT NULL CHECK(length(trim(phone_raw)) > 0),
    phone_normalized TEXT NOT NULL CHECK(length(phone_normalized) BETWEEN 8 AND 16),
    created_at_utc TEXT NOT NULL,
    local_timezone TEXT NOT NULL DEFAULT 'Asia/Almaty',
    selected_phrase_id TEXT,
    template_modified INTEGER NOT NULL DEFAULT 0 CHECK(template_modified IN (0, 1)),
    filter_status TEXT NOT NULL CHECK(filter_status IN ('clear', 'flagged', 'not_checked')),
    filter_rule_ids_json TEXT NOT NULL DEFAULT '[]',
    filter_version TEXT,
    app_version TEXT NOT NULL,
    payload_hash TEXT NOT NULL CHECK(length(payload_hash) = 64),
    privacy_notice_version TEXT,
    privacy_evidence_json TEXT,
    CHECK(filter_status = 'not_checked' OR filter_version IS NOT NULL)
);
CREATE INDEX messages_distance_idx ON messages(distance_km, created_at_utc);
INSERT INTO app_meta(key, value) VALUES ('schema_version', '1');
PRAGMA user_version = 1;
COMMIT;
-- UTF-8, grapheme limits, full UUID/phone validation and canonical hashing belong
-- in the TS UI / native Kotlin validator. SQLite length() is not a grapheme count.
-- Manual moderation status belongs to Excel and is intentionally absent here.
