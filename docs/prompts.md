# Рабочие запросы после START-CODEX

## Интерфейс

«Выполни T02 по PRD/ux-flows/brand-spec/ui-guidelines. Открой локальный HTML-reference,
используй оригинальные assets и tokens, без перерисовки лого/кропа KV. Подключай
success только к native commit, не копируй demo switcher. Проверь 3 языка, ошибки,
caret/custom IME, все поля в одной форме. Запиши что проверено в browser, а что
требует Android/панели. Не расширяй концепцию».

## Хранение и безопасность

«Проверь T03/T04 по architecture/native-bridge/export-contract: DELETE/EXTRA реально
на Android connection, idempotency/PENDING/ID_CONFLICT, закрытый snapshot/restore,
PIN на native, private data/Auto Backup, SAF write/read-back/cancel/lifecycle. Найди
сначала риски потери данных и ложного success. Не считай Python schema smoke
проверкой Android и не заменяй USB-тест browser download».

## Передача

«Пройди release gates и docs/testing; сформируй перечень выполненных и NOT RUN.
Проверь signed APK, холодный офлайн, USB/kiosk, обновление без uninstall, менеджерскую
инструкцию. Не ставь productionAllowed=true без утверждения человека. Ничего не
публикуй, не создавай новые интеграции или NMT».
