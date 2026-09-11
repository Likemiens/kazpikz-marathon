# Реализация · Android, по завершённым срезам

Все задачи приложения **NOT STARTED**. Подготовленный пакет и HTML-reference
не равны реализованному киоску. В каждом срезе: код, проверка отказов, тесты,
обновление фактических команд/решений. Не собирать «всё одним промптом» без проверок.

## T00 · APK / SQLite / USB — первым

Вход: Android update, docs/stack, architecture, android-delivery. Проверить репозиторий
и пакет; заполнить доступную часть device-profile. Создать минимальные Vite/React/
Capacitor и Kotlin plugin, зафиксировать toolchain/lockfile. Не гадать target SDK
или уровень WebView; временный emulator target явно помечать.

Вертикаль: локальный экран → synthetic insert → commit → restart → count →
тестовый ZIP через ACTION_CREATE_DOCUMENT → read-back. Проверить cold start без
сети и ранний crash/cancel путь. Реальный USB и kiosk нужны для закрытия gate;
эмулятор не закрывает их. Сначала убедиться, что OEM вообще позволяет такую поставку.
Не строить настоящий XLSX на этом шаге: тестового небольшого ZIP достаточно.

Выход: тестовый APK/инструкции установки, измеренный паспорт или hardware-blocked,
воспроизводимая команда. Если SDK недоступен, честно записать NOT BUILT и перейти
только к переносимым типам. Не заменять SQLite browser storage.

## T01 · Доменные правила и native контракт

FR-01–04/06, AC-02–04. TS типы/валидация и Kotlin эквивалент по fixtures. kk/ru/en,
10/21/42, Unicode, phone normalization, графемные лимиты, canonical payload hash.
UUID и idempotency: одинаковый запрос/ACK lost/retry/conflict. Native задаёт
время/device_id; запретить свободный SQL. Создаваемые каталоги: src/domain,
src/platform, android/.../native. specs/native-bridge.ts — интерфейс, не реализация.

## T02 · Брендированный рабочий сценарий

FR-01–05/08/17, AC-02–03/10–11/18. Прочитать brand-spec/ui-guidelines и открыть
design/preview.html. Перенести направление в React без demo-switcher. Локальные
оригинальные SVG/PNG, четыре экрана, одна форма; собственная клавиатура с caret,
selection, backspace, сменой языка/символами и цифровым вводом. Не использовать
readonly как нерешённый обход. Имена/телефоны при уходе не остаются на экране.

Подключить настоящий native submit: success только после ACK. Две фразы вставляются
и редактируются. Реальные данные запрещены до privacy approval. Базовый layout
по рабочему reference, после паспорта адаптировать одну фактическую ориентацию.
Не делать новый KV, не подменять SVG и не рисовать логотип марафона.

## T03 · Данные, snapshots и служебный доступ

FR-06/09/12, AC-05–08/12/19. Одна очередь, приватная БД, реальные DELETE/EXTRA,
проверка схемы, ошибки диска/corruption без пересоздания. PIN локально при
подготовке, rate limit/token expiry; публичный UI не имеет export capability.
Короткий drain-close-copy-verify-reopen snapshot, отдельная local backup, integrity
и IDs, test restore. Автокопии только между сессиями на foreground; не обещать
таймер после process kill. Настроить исключение Auto Backup и demo isolation.

## T04 · XLSX → ZIP → USB

FR-11/13/16, AC-07–09/16. Снимок → пагинация → локальный ExcelJS → native staging
→ все/10/21/42 XLSX + moderation + manifest. Телефон строкой, формулы/ссылки не
создаются, moderation без телефона. Ограниченный bridge chunk protocol, не
бесконтрольный JSON большого размера. ZIP проверить локально, затем SAF write +
read-back. Проверить отмену, no space, потерю USB/callback/activity. ZIP backup
SQLite отдельным действием. Никакой desktop atomic-rename модели для content URI.

## T05 · Контент и адекватная модерация

FR-05/07/10/14, AC-09–10/14. Утвердить локали/две фразы/словарь и правила данных.
Пустой словарь означает not_checked, не clear. Создаваемая moderation.xlsx
повторяет contract/template; это не интерактивная админка. Пользовательские строки
не исполняются. Проверить выделение одобренных в новые файлы нужной дистанции;
нет телефонов, отклонённых/новых/использованных. Статусы обратно не импортировать.
Финальный интерфейс ещё требует brand approval даже при готовых исходниках.

## T06 · Android lifecycle / kiosk / install

AC-15–17, NFR-08. Установленный release APK, физический viewport, IME suppression,
пауза/resume/rotation/process kill, сохранность после update тем же ключом и ID.
Запрет cloud backups/remote assets/debug tools в релизе. Keep-screen-on на
foreground. Вместе с поставщиком проверить kiosk+SAF+возврат, не создавать MDM.
Проверить signature conflict без удаления приложения. Инструкция с реальными
кнопками/скриншотами и аппаратным паспортом.

## T07 · Регрессия и приёмка

Выполнить docs/testing.md: все 9 комбинаций, 10k synthetic, offline cold start,
длительная работа, commit/retry, backup/restore, USB, memory, все UI states.
Саша/организатор принимают branded экраны и контрольный прогон менеджера.
Power-cut лишь на тестовых данных и с разрешением владельца оборудования.
Неиспытанное остаётся NOT RUN. Не заявлять исполненный график до доказательств.

## T08 · Передача релиза

Signed APK, SHA-256, версия, исходники/lockfile, настройка PIN, инструкция,
контакты и проверенный способ выгрузки. Чистая production-среда без demo-строк,
конфигурация data/brand approval. Менеджер самостоятельно делает запуск/экспорт/
backup и передачу. Никакого uninstall/clear data для очистки тестов рабочей БД:
демо использует отдельный package ID изначально.

## Порядок после первого среза

T00 → T01 → T02/T03 → T04 → T05/T06 → T07 → T08. В одиночной разработке это
последовательные задачи, а не обязательные параллельные агенты. Блокеры не
расширяют scope. Новый функционал или OEM-обходы согласовать отдельно.
