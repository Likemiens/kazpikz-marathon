export type Language = "kk" | "ru" | "en";
export type Distance = 10 | 21 | 42;
export type FieldName = "runnerName" | "wish" | "phone";

export type Copy = {
  eventName: string;
  distanceTitle: string;
  formTitle: string;
  runnerName: string;
  runnerNamePlaceholder: string;
  wish: string;
  wishPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  readyPhrases: string;
  allPhrases: string;
  phrasesTitle: string;
  close: string;
  back: string;
  submit: string;
  startOver: string;
  successTitle: string;
  successBody: string;
  messageFor: string;
  home: string;
  savingTitle: string;
  savingHint: string;
  replaceTitle: string;
  replaceBody: string;
  replaceConfirm: string;
  resetTitle: string;
  resetBody: string;
  resetConfirm: string;
  cancel: string;
  continue: string;
  idleTitle: string;
  idleBody: (seconds: number) => string;
  required: string;
  nameLength: string;
  wishLength: string;
  phoneFormat: string;
  fixFields: string;
  keyboard: {
    space: string;
    backspace: string;
    shift: string;
    next: string;
    done: string;
    layout: string;
  };
};

export const LANGUAGE_OPTIONS: Array<{ code: Language; label: string }> = [
  { code: "kk", label: "Қазақша" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

export const PHRASES: Record<Language, string[]> = {
  kk: [
    "Әр қадам сені мәреге жақындатады!",
    "Өз қарқыныңмен жүгір. Біз саған сенеміз!",
    "Сен ойлағаннан да мықтысың. Алға!",
    "Жолдың көбі артта қалды. Мәреге дейін алға!",
    "Сенің қарқының, сенің қашықтығың, сенің жеңісің!",
    "Біз сені мәреде күтеміз!",
    "Терең тыныста да, алға жылжи бер!",
    "Бүгін сен біз үшін чемпионсың!",
  ],
  ru: [
    "Каждый шаг приближает тебя к финишу!",
    "Беги в своём темпе. Мы в тебя верим!",
    "Ты сильнее, чем думаешь. Вперёд!",
    "Большая часть пути уже позади. Так держать!",
    "Твой темп, твоя дистанция, твоя победа!",
    "Мы ждём тебя на финише!",
    "Дыши глубже и продолжай движение!",
    "Сегодня ты для нас уже чемпион!",
  ],
  en: [
    "Every step brings you closer to the finish!",
    "Run at your own pace. We believe in you!",
    "You are stronger than you think. Keep going!",
    "Most of the journey is already behind you!",
    "Your pace, your distance, your victory!",
    "We will be waiting for you at the finish!",
    "Breathe deep and keep moving forward!",
    "You are already a champion to us!",
  ],
};

export const CONTENT: Record<Language, Copy> = {
  kk: {
    eventName: "Алматы марафоны",
    distanceTitle: "ҚАТЫСУШЫ ҚАНДАЙ ҚАШЫҚТЫҚҚА ЖҮГІРЕДІ?",
    formTitle: "Жүгірушіге хабарлама",
    runnerName: "Жүгірушінің аты-жөні",
    runnerNamePlaceholder: "Мысалы, Айжан Сейітова",
    wish: "Тілек",
    wishPlaceholder: "Мысалы: «Сенің қолыңнан келеді!»",
    phone: "Телефоның",
    phonePlaceholder: "Мысалы, +7 700 123 45 67",
    readyPhrases: "Дайын тілектер",
    allPhrases: "Барлығын көру",
    phrasesTitle: "Тілекті таңда",
    close: "Жабу",
    back: "Артқа",
    submit: "Тілекті жіберу",
    startOver: "Қайта бастау",
    successTitle: "ТІЛЕК ЖІБЕРІЛДІ",
    successBody: "Қолдауыңа рақмет",
    messageFor: "Тілек кімге арналған",
    home: "Басты экранға",
    savingTitle: "Тілек сақталып жатыр…",
    savingHint: "Қолданбаны жаппа",
    replaceTitle: "Жазылған мәтінді ауыстырасың ба?",
    replaceBody: "Тілек мәтіні таңдалған дайын тілекпен ауыстырылады.",
    replaceConfirm: "Ауыстыру",
    resetTitle: "Қайта бастайсың ба?",
    resetBody: "Енгізілген деректер формадан өшіріледі.",
    resetConfirm: "Иә, қайта бастау",
    cancel: "Бас тарту",
    continue: "Толтыруды жалғастыру",
    idleTitle: "Сен әлі осындасың ба?",
    idleBody: (seconds) => `${seconds} секундтан кейін форма тазартылады.`,
    required: "Бұл өрісті толтыр",
    nameLength: "2–120 таңба енгіз",
    wishLength: "Тілек 1–200 таңбадан тұруы керек",
    phoneFormat: "Ел коды бар нөмірді + белгісімен енгіз",
    fixFields: "Белгіленген өрістерді тексер",
    keyboard: { space: "Бос орын", backspace: "Өшіру", shift: "Регистр", next: "Келесі", done: "Дайын", layout: "Тіл" },
  },
  ru: {
    eventName: "Алматинский марафон",
    distanceTitle: "Какую дистанцию бежит участник?",
    formTitle: "Сообщение бегуну",
    runnerName: "Имя и фамилия бегуна",
    runnerNamePlaceholder: "Например, Айжан Садыкова",
    wish: "Пожелание",
    wishPlaceholder: "Например: «Ты справишься!»",
    phone: "Твой телефон",
    phonePlaceholder: "Например, +7 700 123 45 67",
    readyPhrases: "Готовые пожелания",
    allPhrases: "Все фразы",
    phrasesTitle: "Выбери пожелание",
    close: "Закрыть",
    back: "Назад",
    submit: "Отправить пожелание",
    startOver: "Начать заново",
    successTitle: "ПОЖЕЛАНИЕ ОТПРАВЛЕНО",
    successBody: "Спасибо за поддержку",
    messageFor: "Пожелание для",
    home: "На главный экран",
    savingTitle: "Сохраняем пожелание…",
    savingHint: "Не закрывай приложение",
    replaceTitle: "Заменить написанное?",
    replaceBody: "Текст пожелания будет заменён выбранной фразой.",
    replaceConfirm: "Заменить",
    resetTitle: "Начать заново?",
    resetBody: "Введённые данные будут удалены из формы.",
    resetConfirm: "Да, начать заново",
    cancel: "Отмена",
    continue: "Продолжить заполнение",
    idleTitle: "Ты ещё здесь?",
    idleBody: (seconds) => `Через ${seconds} секунд форма очистится.`,
    required: "Заполни это поле",
    nameLength: "Введи от 2 до 120 символов",
    wishLength: "Пожелание должно содержать от 1 до 200 символов",
    phoneFormat: "Введи + и номер с кодом страны",
    fixFields: "Проверь отмеченные поля",
    keyboard: { space: "Пробел", backspace: "Удалить", shift: "Регистр", next: "Далее", done: "Готово", layout: "Раскладка" },
  },
  en: {
    eventName: "Almaty Marathon",
    distanceTitle: "WHICH DISTANCE IS THE RUNNER TAKING ON?",
    formTitle: "Message to the runner",
    runnerName: "Runner’s full name",
    runnerNamePlaceholder: "For example, Alex Morgan",
    wish: "Your message",
    wishPlaceholder: "For example: “You can do it!”",
    phone: "Your phone number",
    phonePlaceholder: "For example, +7 700 123 45 67",
    readyPhrases: "Ready-made messages",
    allPhrases: "View all",
    phrasesTitle: "Choose a message",
    close: "Close",
    back: "Back",
    submit: "Send message",
    startOver: "Start again",
    successTitle: "MESSAGE SENT",
    successBody: "Thank you for your support",
    messageFor: "Message for",
    home: "Back to start",
    savingTitle: "Saving your message…",
    savingHint: "Please keep the app open",
    replaceTitle: "Replace your message?",
    replaceBody: "Your message will be replaced with the selected phrase.",
    replaceConfirm: "Replace",
    resetTitle: "Start again?",
    resetBody: "Your entries will be cleared from the form.",
    resetConfirm: "Yes, start again",
    cancel: "Cancel",
    continue: "Keep writing",
    idleTitle: "Are you still here?",
    idleBody: (seconds) => `The form will clear in ${seconds} seconds.`,
    required: "Complete this field",
    nameLength: "Enter between 2 and 120 characters",
    wishLength: "Your message must contain between 1 and 200 characters",
    phoneFormat: "Enter + and your number with its country code",
    fixFields: "Check the highlighted fields",
    keyboard: { space: "Space", backspace: "Delete", shift: "Shift", next: "Next", done: "Done", layout: "Layout" },
  },
};
