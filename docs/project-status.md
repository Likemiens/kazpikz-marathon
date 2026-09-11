# Статус проекта · 11.09.2026

## Готово

- Проект создан только в `G:\PROJECTS\kazpikz-marathon`.
- Исходный Android brand pack v2 разложен в корне репозитория.
- В `demo/` реализован интерактивный React + TypeScript + Vite прототип четырёх публичных экранов.
- Использованы оригинальные KV и Kaspi.kz SVG без перерисовки.
- Реализованы три локали, три дистанции, валидация, готовые фразы, экранная клавиатура, safe reset, saving/success и 4-секундный возврат.
- Демо не сохраняет и не логирует форму.
- TypeScript strict-check, production build и worker smoke-test проходят локально.
- Браузерный smoke пройден в Codex in-app Browser на 1280×720 (эквивалент 16:9 reference): RU/KK/EN, обязательные поля, phrase replacement, virtual keyboard, saving, success, auto-reset. Ошибок и warning в console не обнаружено.

## Не готово и не заявляется готовым

- Android/Capacitor проект и APK.
- Реальный Kotlin native bridge, SQLite commit/retry и восстановление.
- XLSX/ZIP, PIN, SAF и USB read-back.
- Kiosk, lifecycle, update тем же ключом и испытания целевой 55″ панели.
- Утверждённые переводы, privacy-текст, словарь и финальный brand approval.

## Следующий срез

T00 из `docs/implementation-plan.md`: получить паспорт панели и проверить минимальный APK с реальным SQLite и SAF на эмуляторе, затем на фактическом устройстве. Browser demo не должен становиться production storage fallback.

## Выполненные проверки

```text
npm run typecheck  PASS
npm run build      PASS
npm run test:sites PASS
Browser smoke      PASS (UX demo only)
Android / USB      NOT RUN
```
