# AGENTS · Marathon Messages / Android

Development handoff v2.0. Одна офлайн-панель собирает послания, отбор — в Excel.

## Читать

README → docs/project-context → docs/prd → docs/implementation-plan.
Для UI: docs/brand-spec, ui-guidelines, ux-flows, design/preview.html.
Для платформы: docs/architecture, android-delivery, specs/native-bridge.ts.
Для выпуска: docs/testing, release-plan, risks-and-assumptions.

Последнее прямое решение владельца > текущий PRD/decisions > исходные источники >
технические предположения. Не подменять пробелы «общеизвестным» решением.

## Не менять

Одна Android-панель 55″; kk/ru/en; 10/21/42; язык → дистанция → одна форма с именем
бегуна, пожеланием и телефоном → commit → подтверждение → очистка. Scope 60k:
готовые фразы и Excel-модерация, не игровая анимация, live LED, админка или облако.
NMT/Canon/nmt-skills не устанавливать. Не создавать аккаунты, репозиторий или деплой
без запроса. Не переносить чужие клиентские материалы.

## Android

React/TS/Vite + Capacitor; native Kotlin SQLite и SAF. Electron, .exe и браузерный
localStorage как хранилище исключены. Сначала T00: APK/SQLite/USB spike. Android
подтверждён, версия/WebView/разрешение/ориентация — нет. Не угадывать их.
Зависимости stable и совместимые, после setup фиксировать runtime и lockfile.
Не обещать совместимость любого Android или полную kiosk-блокировку.

БД в приватных app data, не cache/USB. Одна очередь операций, транзакция, success
только после commit; retry одного ID не дублирует запись. Нативный слой валидирует
ввод и операторские права. Никакого generic executeSql/readFile/shell в bridge.
Предлагаемый DELETE/EXTRA и закрытый снимок описаны в architecture; не возвращать
WAL/online-backup из старого пакета без нового решения и тестов.

Экспорт → локально проверенный ZIP → ACTION_CREATE_DOCUMENT → USB → read-back.
content:// не обычный путь; нельзя обещать atomic rename. Прерванный документ
не считается экспортом. Backup отдельный, не XLSX. Во время записи не удалять БД.
Запрещены uninstall/clear data как способ исправления. Отключить Auto Backup и
проверить обновление тем же package ID/ключом без потери данных.

## Бренд

В assets/brand реальные исходники, не заглушки. Логотипы использовать без изменения
цвета/пропорций/opacity/filter. #F14635 — официальный цвет; глубокий красно-коричневый
и UI-токены — наша адаптация KV, не официальный стандарт. KV показывать целиком,
не вырезать людей/надписи. Отдельного знака марафона и шрифтов нет. Не трассировать
лого и не генерировать новые фотографии. Перед релизом нужен approval экранов.

## Проверка

Сейчас есть python scripts/validate_pack.py и HTML-референс, но не APK и не scripts
npm/Gradle. Команды создать и проверять по факту. Один минимальный завершённый срез
за сессию; тесты, ошибки и обновление документов входят в него.
Без native bridge production сбор запрещён, никакого фиктивного success.
HTML/browser smoke не равен Android, USB или power-cut тесту.

Реальные имена/телефоны/PIN не помещать в Git, логи, fixtures и скриншоты. Локали,
словарь и privacy пока draft/pending. До их утверждения — только синтетические
данные. В конце сессии: изменения, выполненные команды и результаты, что не
проверено, следующий срез. Не писать «Launch Ready» без выполненного release gate.
