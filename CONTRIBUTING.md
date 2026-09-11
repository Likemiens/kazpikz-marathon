# Разработка

Перед изменениями прочитайте `docs/prd.md`, `docs/decisions.md` и `docs/ui-guidelines.md`. Для Android-слоя дополнительно обязательны `docs/architecture.md` и `docs/android-delivery.md`.

## Демо

```bash
cd demo
npm install
npm run check
```

Сохраняйте изменения небольшими завершёнными срезами. Не добавляйте localStorage/IndexedDB как production-хранилище и не показывайте success до подтверждённого native commit. Реальные имена, телефоны, PIN, базы, ключи подписи и выгрузки запрещены в коде, fixtures, логах и скриншотах.

## Pull request

В описании укажите изменённый пользовательский сценарий, выполненные команды, непроверенные Android/device gates и приложите только синтетические тестовые данные.
