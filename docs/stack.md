# Стек · Android APK

**Target Android подтверждён клиентом; технологии ниже предложены нами.** Один
репозиторий и одна целевая панель, без отдельного сервиса и монорепозитория.

## Выбранное направление

React + TypeScript + Vite — интерфейс. Простой CSS с локальными tokens.css;
дополнительная UI-библиотека не обязательна. Существующий HTML-референс — не
React-код и не production UI, а точное направление композиции.

Capacitor — нативная Android-оболочка для локально собранных web assets. Ionic UI
не нужен. Kotlin локальный плагин `MarathonNative` — валидация, SQLite, PIN,
снимки, запись ZIP через SAF и диагностика. Не публиковать отдельный plugin package.

SQLiteOpenHelper / системная SQLite — одна маленькая БД и одна очередь. Предлагаем
DELETE + EXTRA и snapshot при закрытой БД; это отдельное решение вместо старого
desktop-WAL. Без Room/ORM/SQLCipher по умолчанию, без Node-native SQLite модуля.
Если нужна криптография базы, это отдельное согласованное требование; sandbox/PIN
не называть шифрованием. Обсуждение privacy — не юридическая консультация.

ExcelJS — генератор XLSX в локальном служебном UI, после operator auth, из
неизменяемого снимка native. Проверить memory use на 10k synthetic. Нативный ZIP
архивируется из staging; bridge передаёт ограниченные страницы и binary chunks,
а не все телефоны в один огромный JSON. Подробности в архитектуре и контракте.

Vitest/Testing Library для UI/домена; Playwright — браузерные сценарии, не проверка
Android storage. JUnit/instrumentation — native слой; эмулятор и реальная панель
для APK. Не устанавливать второй мобильный стек или E2E framework без нужды.

## Версии и блокер железа

При проверке 10.09.2026 официальная документация Capacitor v8 указывает Android
API 24+ и WebView Chrome 60+. Это нижний порог runtime, не гарантия работы нашего
Vite/JS/CSS на старом WebView. Свежие сборщики и библиотечные API могут требовать
более новый движок. Не выбирать версию пакета по одному «Android есть».

В T00 заполнить specs/device-profile.template.json и зафиксировать Node, npm,
Capacitor core/android/cli одной совместимой версии, JDK, Gradle/AGP/SDK, minSdk,
compileSdk, targetSdk, WebView build target, ABI и lockfile. Не обещать APK для
Android 5/6; не откатывать без решения на неподдерживаемый стек.

Если реальная панель несовместима, остановить платформенный срез: предложить
поставщику поддерживаемую прошивку/WebView/вычислитель и согласовать объём. Не
подменять поставку онлайн-сайтом. Временный emulator target не равен реальному.

## Сборка / среда

package.json, lockfile, android/ и Gradle wrapper появятся при setup. Пока команды
npm run build, npx cap sync android и gradlew assembleRelease — целевой workflow,
не созданные или проверенные команды этого ZIP. Зафиксировать их только после
реальной сборки. Android Studio/SDK/JDK нужны разработчику, не менеджеру.

Релиз: signed APK, стабильный applicationId и ключ, без server.url/live reload,
без external navigation/CDN, без Play-зависимости. Способ установки разрешён
клиентом, но полный install-test всё равно нужен. Play Store/MDM backend не входят.

## Исключения

Electron/.exe, Next.js/SSR, PWA-only, Supabase/Firebase, localStorage/IndexedDB как
основная БД, remote fonts, внешние AI/API, NMT, платежи, аналитика и автообновления.
Capacitor сам по себе не даёт гарантированного USB-export и lock-task: native
реализация и проверка OEM прошивки остаются частью проекта.

Источники AND-01…AND-08: [реестр](source-register.md). Данные об API — внешняя
техническая проверка; конкретная архитектура — наше проектное решение.
