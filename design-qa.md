# Design QA · Landscape wish flow

Дата проверки: 14 сентября 2026 года.

## Визуальная истина и среда

- Актуальный источник направления — правки владельца от 14.09.2026: один горизонтальный формат, два логотипа, кампейн-слоган, крупный CTA о 27 сентября, обращение на «ты», без приписки о ролике и без мелких инструкций.
- Бренд-источник: `G:\PROJECTS\kazpikz-marathon\assets\brand\kv-original.png`, 1224×684 px, сохранён без изменений. Для фактического верхнего слота создана отдельная широкая адаптация `assets/brand/kv-landscape-wide-v1.png` с сохранением двух логотипов, слогана, бегунов и трека.
- Реализация: `http://localhost:4173/`. Финальный browser capture выполнен при viewport 1085×1272 CSS px; приложение занимает 1085×610 CSS px, отношение 1.778, и центрируется без document overflow. Browser возвращает снимок inline без постоянного filesystem path.
- Шрифт: локальный Roboto 400/500/700/900; сетевые шрифты не используются.

## Проверенные состояния

1. Welcome: широкая KV-адаптация заполняет верхнюю зону edge-to-edge, оба логотипа, слоган и оба бегуна видимы целиком; CTA и три языка читаются в отдельной нижней action-панели.
2. Дистанция: шапка сохраняет оба логотипа, вопрос набран крупно и наклонно, 10 / 21 / 42 км показаны тремя равноправными outlined-блоками без теней.
3. Форма: заголовок «Сообщение бегуну · 21 км» содержит выбранную дистанцию без отдельной плашки; имя и телефон образуют равный верхний ряд, пожелание и шесть быстрых фраз занимают всю ширину, все восемь доступны в overlay, CTA полноширинный.
4. Клавиатура: занимает всю ширину, начинается непосредственно с клавиш, CTA остаётся видимым.
5. Успех: горизонтальная композиция с двумя логотипами, синтетическими именем `Айжан Садыкова`, пожеланием `Мы ждём тебя на финише!` и дистанцией `21 км`; телефон не выводится.

## Исправления текущего прохода

- **P1:** portrait canvas противоречил последнему направлению. Все публичные состояния пересобраны под фиксированный 16:9 landscape canvas.
- **P1:** на последующих экранах был только Kaspi.kz. Header теперь использует верхнюю часть официального KV как переданный источник сразу двух логотипов; отдельный Almaty Marathon logo не выдуман.
- **P2:** welcome не использовал кампейн-систему целиком. Возвращён исходный KV с обоими логотипами и слоганом, под ним добавлен крупный CTA о 27 сентября.
- **P2:** смешивались обращения на «ты» и «вы». Русский и казахский публичный copy унифицирован на неформальное обращение.
- **P2:** оставалась формулировка про возможное включение в ролик. Она удалена из видимого интерфейса и контентных строк.
- **P2:** заголовок формы не соответствовал правке. Во всех локалях он заменён на эквивалент «Сообщение бегуну».
- **P2:** часть пояснений была слишком мелкой. Необязательные подсказки убраны, а обязательные labels, готовые фразы и кнопки получили увеличенный кегль.

### Welcome refinement · 14.09.2026

- **P2:** нижняя action-панель занимала 25.5% высоты и перекрывала нижнюю часть KV, из-за чего ноги второго бегуна визуально обрезались.
- **Исправление:** KV пропорционально уменьшен до 88% ширины и выровнен по верхнему краю; панель снижена до 15.5% высоты, вертикальные padding сокращены без уменьшения шрифта или touch-targets.
- **Проверка после:** при viewport 1280×720 KV занимает 1126×629 px, панель — 112 px; перекрытие составляет только 21 px и не закрывает слоган или фигуры бегунов. CTA остаётся в две строки, три языковые кнопки помещаются в один ряд. Новых P0/P1/P2 не найдено.

### Wide KV and form-layout refinement · 14.09.2026

- **P2:** исходный 16:9 KV в зоне шире 2:1 либо оставлял боковые поля, либо требовал заметного кадрирования.
- **Исправление:** встроенным ImageGen подготовлен `kv-landscape-wide-v1.png` с арт-дирекцией на сохранение официальной композиции и расширение фактуры трека по горизонтали; исходник не перезаписан.
- **P2:** дистанция дублировалась в отдельной плашке, а двухколоночная форма создавала пустую зону под полями имени и телефона.
- **Исправление:** плашка удалена, дистанция встроена в заголовок; одна поверхность пересобрана в последовательную иерархию по принципам Apple Design — равный ряд идентификационных полей, полноширинные сообщение, фразы и CTA, предсказуемые pressed/focus-состояния без лишней глубины.
- **Проверка после:** в in-app Browser на русском сценарии выбранные `21 км` присутствуют в заголовке, отдельного distance-chip нет, шесть фраз и клавиатура видимы одновременно, оба поля имеют одинаковую высоту и ширину.

## Техническая проверка

- `npm run check`: TypeScript strict-check, production Vite build, Sites packaging и 4/4 worker tests — PASS.
- Загруженный welcome KV: `naturalWidth = 1840`, `naturalHeight = 854`, ratio `2.15:1`; исходный KV остаётся `1224×684` и не изменён.
- Видимая app-frame: 1085×610, отношение 1.778; `document.scrollWidth = 1085`, `document.scrollHeight = 1272`, равны viewport по соответствующим осям.
- CTA про 27 сентября найден в видимом тексте; запрещённая приписка о ролике отсутствует.
- Пройден путь `Русский → 21 км → имя → телефон → готовая фраза → отправка → главный экран`.
- После перезапуска Vite через `localhost` новых console errors или warnings не появилось; сохранённый в dev-log ранний HMR warning относится к предыдущему запуску через `127.0.0.1`.
- Финальная in-app Browser проверка: welcome заполняет широкий слот без боковых полей; форма `Сообщение бегуну · 21 км` одновременно показывает два равных input, шесть фраз, полноширинный CTA и компактную клавиатуру. Состояние трёх пустых полей также проверено: inline-ошибки читаются и не перекрывают «Все фразы» или CTA.

## Остаточный риск

Физические размеры touch-targets, системную IME, яркость, safe areas и читаемость нужно подтвердить на целевой Android-панели в её фактическом 16:9 viewport. Обещание появления пожелания на городских экранах требует согласовать операционный отбор и критерии публикации; демо по-прежнему показывает только сообщение текущего посетителя и не хранит реальные данные.

### Direct final preview · 14.09.2026

- Референс владельца: `C:\Users\alexa\AppData\Local\Temp\codex-clipboard-de14d7e3-7789-44ea-aadd-4c9b9a662f1f.png`, 2298×1287, горизонтальный экран подтверждения с двумя логотипами, красным фоном, левой статусной группой и одной белой карточкой пожелания.
- Реализация: `http://localhost:4173/?screen=final`; проверена в in-app Browser в фиксированном 16:9 canvas. Видимая иерархия совпадает с референсом: брендовый header, статус «Пожелание отправлено», имя, цитата, дистанция и кнопка возврата. Телефон отсутствует.
- Проверены RU и EN через `lang`; данные синтетические и локализованные. Прямой просмотр сохранился дольше штатного восьмисекундного таймера, а кнопка «На главный экран» очистила query и вернула S01.
- Геометрия, цвета, Roboto, радиусы, отступы и контраст опираются на уже утверждённый S04; новых P0/P1/P2 расхождений с переданным экраном не найдено.
- Обычный сценарий отправки не изменён: он показывает фактические данные текущей попытки и сбрасывается через восемь секунд.

### TV wish display · 15.09.2026

- Направление владельца: превратить S04 в телевизионный 16:9 экран — фирменный цветной фон, оба логотипа сверху, по центру получатель, пожелание и дистанция.
- Проверка выполнена в in-app Browser при явном viewport 1920×1080. Canvas заполняет весь viewport без document overflow; header занимает 16.5% высоты и показывает Kaspi.kz и Almaty Marathon самостоятельными логотипами.
- Основная зона использует `#F14635`; имя, пожелание и дистанция центрированы по обеим осям. Удалены split-layout, checkmark, белая карточка и кнопка возврата. Телефон и служебные данные отсутствуют.
- Базовый пример `Айжан Садыкова` / `Ты сильнее, чем думаешь. Вперёд!` / `21 км` читается с телевизионной дистанции. Для 71–120 и 121–200 символов предусмотрены два понижающих класса размера, а длинные имена получают отдельный компактный размер.
- AX-дерево сохраняет получателя как заголовок, текст пожелания и дистанцию; скрытая метка состояния остаётся только как `aria-label`. Runtime-ошибок React не обнаружено; сохранённый Vite-log содержит только ожидаемый WebSocket reconnect во время предыдущей остановки dev-сервера.

### Integrated TV logos · 15.09.2026

- По аннотации владельца текстурная KV-шапка убрана с S04; весь 1920×1080 canvas теперь воспринимается как единый фон `#F14635`.
- Kaspi.kz загружается отдельным официальным белым SVG. Ранний проход изолировал Almaty Marathon runtime-crop/filter/blend; решение заменено следующим проходом на самостоятельный прозрачный PNG, точно извлечённый из предоставленного KV.
- Логотипы имеют независимые контейнеры, безопасные поля 5cqw и сохраняют исходные пропорции. Нижняя граница или отдельная цветовая полоса отсутствуют; центр пожелания не смещён.

### Uncropped internal headers · 15.09.2026

- Визуальная истина: `C:\Users\alexa\AppData\Local\Temp\codex-clipboard-68d01aa2-3c7e-4129-8a9e-3586f1010e8c.png`, 982×184 px. На референсе нижняя часть Kaspi.kz обрезана границей слота; требование владельца — разместить оба логотипа самостоятельными ассетами непосредственно в шапке.
- Реализация проверена в Codex in-app Browser на `http://localhost:4173/` в состояниях S02 и S03 при viewport 982×1272 CSS px. Browser capture возвращён inline без постоянного filesystem path; в сравнительном просмотре использовались исходный референс и финальный capture одного масштаба шапки.
- **P1 исправлено:** общий `kv-original.png` больше не растягивается и не кадрируется внутри header. Kaspi.kz использует официальный `kaspikz-logo-white.svg`, Almaty Marathon — точный прозрачный PNG-фрагмент из предоставленного KV.
- Оба логотипа полностью видны, сохраняют пропорции и независимые safe areas; шапка S02/S03/S04 не применяет runtime crop, filter, blend или opacity. Welcome по-прежнему использует утверждённый широкий KV и визуально не изменился.
- `npm run check`: TypeScript, production Vite build, Sites packaging и 4/4 worker tests — PASS. Новых P0/P1/P2 расхождений после browser-проверки не найдено.

### Flat logo header correction · 15.09.2026

- Source visual truth: `C:\Users\alexa\AppData\Local\Temp\codex-clipboard-dccb0e58-4b6e-4c67-bb9d-c3059def1ab1.png`, 982×184 px at 1×. Требование владельца: полностью удалить KV/texture image из внутренних шапок, оставить два самостоятельных логотипа и выровнять их по сетке контролов.
- Implementation screenshot: inline Codex in-app Browser capture, tab `http://localhost:4173/`, viewport 982×1272 CSS px, DPR 1. Постоянный filesystem path Browser не возвращает. Проверены S02 и S03; focused comparison выполнен по верхней области 982 px шириной, соответствующей source crop.
- **Earlier P1:** после первого прохода вкладка продолжала показывать старую HMR-разметку с единым изображением `Kaspi.kz и Алматинский марафон` и текстурным фоном. В AX это был один image-узел, поэтому замечание владельца воспроизводилось.
- **Fix:** вкладка полностью перезагружена; `.app-header` использует `background-color: rgb(241, 70, 53)` и вычисленное `background-image: none`. В DOM находятся ровно два image-узла: официальный Kaspi.kz SVG 526×135 и самостоятельный прозрачный Almaty Marathon PNG 380×70.
- **Post-fix evidence:** header padding слева/справа 29.46 px; Kaspi.kz начинается на x=29.45, Almaty Marathon заканчивается на x=952.55. На S03 кнопка «Назад» и поверхность формы имеют те же края x=29.45 / 952.55. На S02 та же 3cqw сетка применена к кнопке и карточкам дистанций. Фоновая фактура отсутствует, логотипы не кадрируются.
- Fonts/typography: Roboto и существующая иерархия внутренних экранов не изменены. Spacing/layout: внешние края логотипов и рабочих поверхностей совпадают. Colors/tokens: только плоский `#F14635`, без изображения и opacity. Image quality: Kaspi.kz остаётся vector, Almaty Marathon сохраняет прозрачность и исходные пропорции без runtime filter. Copy/content: не изменены.
- Full-view comparison показал сохранение 16:9 композиции и всех контролов. Focused header comparison был необходим из-за точного требования к фону, логотипам и краям; новых P0/P1/P2 после исправления нет.
- `npm run check`: TypeScript, production Vite build, Sites packaging и 4/4 worker tests — PASS.

### Canonical Almaty lockup and bilingual welcome · 17.09.2026

- **Source visual truth:** `C:\Users\alexa\Downloads\Telegram Desktop\Asset 1.svg`
  (viewBox `3060.38×714.29`) and `Asset 1@4x.png` (`911×213` source pixels).
  The SVG is the canonical geometry; the PNG was used as the supplied visual
  reference. The existing approved `assets/brand/kv-landscape-wide-v1.png`
  remains the welcome artwork source.
- **Implementation evidence:** inline Codex in-app Browser captures from
  `http://localhost:4173/`, viewport `1280×720` CSS px, DPR 1. States checked:
  S01 welcome, S02 distance, S03 `Русский → 21 км`, and S04
  `?screen=final`. Browser screenshots are not exposed as persistent filesystem
  paths by the in-app connector; the URL and state are reproducible.
- **Full-view comparison:** S01 shows the independent white Kaspi.kz and exact
  Almaty lockup in a flat brand strip, the new Kazakh slogan, bilingual CTA
  (Kazakh left / Russian right), and the language selector lifted onto the
  artwork. S02/S03 show the full-color Kaspi logo and black Almaty lockup on a
  neutral header. S04 shows both white logos directly on the flat red TV canvas.
- **Focused comparison:** the header/logo crop was required because the owner
  explicitly rejected a raster header background. The lockup is now an exact
  supplied vector with no crop, filter, opacity or background image; the
  internal header keeps the same 3cqw outer gutter as the back button and form.

#### Required fidelity surfaces

- **Fonts/typography:** existing Roboto family and italic display treatment are
  retained; the new slogan and CTA use readable weights and line heights at the
  16:9 viewport.
- **Spacing/layout rhythm:** two-column bottom CTA, artwork-level language
  picker, equal internal header gutters, and S02 guidance fit without document
  overflow in the checked viewport.
- **Colors/tokens:** internal headers use the light surface token; welcome/S04
  use the existing Kaspi red/brand-track tokens. No raster texture is used in
  S02/S03/S04 headers.
- **Image quality/asset fidelity:** Almaty Marathon is rendered from the
  owner-supplied SVG; the white variant preserves its geometry for dark/red
  surfaces. Kaspi remains the bundled official SVG. No hand-drawn logo or CSS
  approximation was introduced.
- **Copy/content:** `10 жыл бойы қарқынымыз бәсеңдемеді`, `Тілді таңда /
  Выбери язык`, both requested CTA strings, the participant moderation guidance,
  and empty saving hint are present in the intended states. The phrase about
  keeping the app open is not rendered.

#### Comparison history

- **Earlier P1:** the first welcome overlay was translucent and let the legacy
  baked slogan show through beneath the new Kazakh copy. **Fix:** expanded the
  opaque slogan cover to the full legacy text band and recaptured S01 at the
  same viewport; the old slogan is no longer visible.
- **Post-fix evidence:** final S01/S02/S03/S04 captures show no actionable P0,
  P1 or P2 visual findings. Browser console check returned no errors or warnings.
- `npm run check`: TypeScript, production Vite build, Sites packaging and 4/4
  worker tests — PASS.

### Baked slogan localization variant · 17.09.2026

- **Source visual truth:** the generated sibling asset
  `assets/brand/kv-landscape-wide-v2.png` is derived from the approved wide KV and
  contains the exact Kazakh copy `10 жыл бойы қарқынымыз бәсеңдемеді` in the raster.
- **Implementation evidence:** the local S01 capture at `1280×720` CSS px shows the
  slogan inside the artwork with no duplicate `welcome-slogan` DOM element. The
  separate white logo strip remains on top for the canonical owner-supplied lockup.
- **Focused comparison:** compared with `kv-landscape-wide-v1.png`, the new variant
  preserves the track, runners and wide framing while replacing only the campaign
  text. No actionable P0/P1/P2 findings were introduced.
- `npm run check`: TypeScript, production Vite build, Sites packaging and 4/4
  worker tests — PASS.

### Internal header rollback · 17.09.2026

- **Owner correction:** S02/S03 retain the original flat red header; only the
  standalone white Kaspi.kz and Almaty Marathon logos remain in the header.
- **Verification:** local and production captures show the red header on both the
  distance selection screen and the message form. The distance question still
  appears after language selection and was not otherwise changed.
- `npm run check`: TypeScript, production Vite build, Sites packaging and 4/4
  worker tests — PASS.

### Form keyboard drawer and density · 17.09.2026

- **Before:** the custom keyboard was always mounted, reserving vertical space
  before the user interacted with a field; the compact form made the phrase sheet
  feel displaced and the logo header consumed too much height.
- **After:** the keyboard is closed on entry and opens from the bottom only after
  input focus, then collapses on blur/«Готово». The header is reduced to a compact
  13cqh band; all six quick phrases and «Все фразы» stay visible when idle.
- **Focused comparison:** local S03 captures at `1280×720` CSS px show both idle
  and focused states with no clipped phrase action and no reserved keyboard gap.
- `npm run check`: TypeScript, production Vite build, Sites packaging and 4/4
  worker tests — PASS.

### Welcome logo clearance and shared geometry · 17.09.2026

- **Owner finding:** S01 показывал KV с baked-in логотипами в отдельной верхней
  плашке; их масштаб и положение расходились с S02/S03.
- **Fix:** создан `assets/brand/kv-landscape-wide-v3.png` — тот же wide KV с
  очищенной верхней зоной. На прозрачном слое поверх него используются те же
  независимые белые логотипы и CSS-геометрия, что и во внутренних шапках.
- **Focused comparison:** local S01/S03 captures at `1280×720` CSS px дают
  одинаковые значения: header/strip `h=93.59375px`, Kaspi `256×65.703125px`,
  Almaty `320×74.6875px`, x-gutters `38.39px` / `38.39px`.
- **Post-fix evidence:** верхняя красная плашка исчезла; логотипы лежат на
  текстуре KV, lane line и runners сохранены, crop/filter/opacity не применяются.
- `npm run check`: TypeScript, production Vite build, Sites packaging и 4/4
  worker tests — PASS.

final result: passed
