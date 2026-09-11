# Источники · v2 / 10.09.2026

Требования/брендинг берём из материалов пользователя. Внешние Android/SQLite docs
ниже обосновывают предлагаемую реализацию, не подменяют бриф. Схема документов
унаследована из предоставленного v1-пакета; новых методологий не добавлено.

## Материалы

SRC-01 — [оригинал брифа](../sources/client-brief.docx) и
[текст](../sources/client-brief-extracted.md). Сценарий/даты/поля/офлайн/экспорт/
модерация и приёмка. Год в документе не написан, 2026 — рабочий контекст.

SRC-02 — [ранние ответы клиента](../sources/client-confirmations.md): 1 панель,
55″, разрешена установка, есть USB, нет интернета, менеджер. Ответ про неизвестную
ОС исторический; последний Android update ниже его заменяет.

SRC-03 — [отправленная концепция](../sources/sent-concept.md): база 50k, дополнение
10k фразы+Excel. «На экран» в связке с брифом — отбор для роликов, не live API.

SRC-04 — [KV PNG](../assets/brand/kv-original.png), 1224×684, передан в этой переписке.
Растр содержит обе марки/надписи/бегунов, не слои. Цветовые samples — наши вычисления,
не официальный стандарт. Пиксели не редактировались.

SRC-05 — [PDF правил](../sources/kaspi-logo-guidelines.pdf), 27 страниц. Изучены
с.2/4/6–9: официальный #F14635; варианты; контраст/подложка; запреты. Просмотрены
рендеры страниц 4 и 8, а остальные соответствующие страницы доступны в переданном
файле и их содержимое сверено с извлечённым текстом/изображениями.

SRC-06 — исходный Logo Kaspi.kz (1).zip: выбранные подлинные SVG/PNG из него
в assets/brand/logos. В пакете только 4 подходящих варианта, без системных
MacOS-файлов/печатных EPS/ненужных брендов. SHA исходного ZIP в manifest.

SRC-07 — [последнее сообщение об Android и брендинге](../sources/client-update-android-brand.md).
Android теперь факт, версия/модель/OEM функции не названы.

## Система пользователя

**SYS-01 — Founder_Product_System_v2.0.md, версия 26.07.2026.** Указан в исходном пакете v1 как найденный в File Library; в обновлении v2 отдельно не запрашивался. Использованы разделы 13 «Стандарт PRD», 14 «Пакет для Codex», 16 «Ворота готовности». Применена структура 0–14, проверяемые требования и разделение готовности к работе / к выпуску. Исходный файл доступен как библиотечная ссылка, локальная копия в архив не включена.

**SYS-02 — bootstrap_prompt.md, 23.07.2026.** Указан в v1 как источник File Library; в v2 отдельно не запрашивался. Использованы короткий AGENTS, компактный project-context, Confirmed/Inferred/Assumed, правила отсутствующих команд, provisional stack и минимальных изменений. Локальная копия не включена.

**SYS-03 — Umap Lab Estimation Template.md, версия 0.2 от 29.06.2026.** [Исходник](../sources/lab-estimation-reference.md). Использованы ограничение объёма, работа по результатам и явные допущения. Новая цена и маржа не рассчитывались.

Адаптация описана в [system-adaptation.md](../sources/system-adaptation.md). Стратегические части и NMT исключены по прямому указанию пользователя. Материалы других клиентских проектов не являются источником спецификации этого оборудования.


## Внешняя техническая проверка · official primary sources

Проверены 10.09.2026. URL для разработчика, не зависимости runtime. Точные package
versions и лицензии фиксирует T00. Чтение документации не заменяет сборку/устройство.

AND-01 — Capacitor Android, https://capacitorjs.com/docs/android . Документация v8
указывает API 24+/WebView Chrome 60+ и Android runtime. Это нижняя планка shell,
не наша гарантия совместимости всего bundle с любым таким устройством.

AND-02 — Android native plugins, https://capacitorjs.com/docs/plugins/android .
Java/Kotlin методы, native callback Activity и типизированное взаимодействие.
MarathonNative — наш предлагаемый локальный плагин, не готовая библиотека Capacitor.

AND-03 — Storage Access Framework,
https://developer.android.com/training/data-storage/shared/documents-files .
Системные create/open/tree intents, URI, ContentResolver, ограниченные права.
Отсюда выбран ACTION_CREATE_DOCUMENT для одного ZIP; OEM USB надо проверить.

AND-04 — App-specific storage,
https://developer.android.com/training/data-storage/app-specific . Приватные
файлы/кэш и удаление данных приложения при uninstall. Внешняя копия обязательна
для защиты от потери private data; это не обещание шифрования базы.

AND-05 — Lock task,
https://developer.android.com/work/dpc/dedicated-devices/lock-task-mode .
Allowlisting/DPC и отличие screen pinning. Настройка конкретной панели неизвестна.

AND-06 — SQLiteOpenHelper,
https://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper .
Lifecycle схемы/connections. Native реализация и её транзакции требуют тестов.

AND-07 — SQLite PRAGMA, https://www.sqlite.org/pragma.html .
journal/synchronous/integrity. Для предложенного rollback DELETE выбран EXTRA:
он дополняет FULL синхронизацией каталога после unlink journal. Это не устраняет
неисправность памяти/прошивки и не подтверждает реальный режим Android connection.

AND-08 — Auto Backup, https://developer.android.com/identity/data/autobackup .
Явное allowBackup=false; Android 12+ D2D/OEM поведение требует отдельных правил
и проверки, не только одного флага.

AND-09 — Capacitor config, https://capacitorjs.com/docs/config .
Local bundle/config и ограничения remote server для production. Offline проверяется.

## Границы

Нет проверки законодательства, реальной панели, release APK, аппаратной USB,
полного kiosk и точной гарнитуры. Визуальное направление proposed; package checks
не утверждают тексты/бренд/реальную базу за организатора.
