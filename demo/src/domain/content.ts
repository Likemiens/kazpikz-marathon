export type Language = "kk" | "ru" | "en";
export type Distance = 10 | 21 | 42;
export type FieldName = "runnerName" | "wish" | "phone";

export type Copy = {
  distanceTitle: string;
  headline: string;
  intro: string;
  formTitle: string;
  runnerName: string;
  runnerNamePlaceholder: string;
  wish: string;
  wishPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  phoneHint: string;
  readyPhrases: string;
  requiredHint: string;
  back: string;
  submit: string;
  startOver: string;
  successTitle: string;
  successBody: string;
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
  privacyDraft: string;
  demoNotice: string;
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

export const PHRASES: Record<Language, [string, string]> = {
  kk: ["Әр қадам сені мәреге жақындатады!", "Өз қарқыныңмен жүгір. Біз саған сенеміз!"],
  ru: ["Каждый шаг приближает тебя к финишу!", "Беги в своём темпе. Мы в тебя верим!"],
  en: ["Every step brings you closer to the finish!", "Run at your own pace. We believe in you!"],
};

export const CONTENT: Record<Language, Copy> = {
  kk: {
    distanceTitle: "ҚАТЫСУШЫ ҚАНДАЙ ҚАШЫҚТЫҚҚА ЖҮГІРЕДІ?",
    headline: "СЕНІҢ СӨЗДЕРІҢ МӘРЕГЕ ЖЕТУГЕ КӨМЕКТЕСЕДІ",
    intro: "Марафон қатысушысына тілек қалдыр. Оны қолдау бейнеролигіне қосуы мүмкін.",
    formTitle: "ЖҮГІРУШІНІ ҚОЛДАҢЫЗ",
    runnerName: "Жүгірушінің аты-жөні",
    runnerNamePlaceholder: "Тілегіңіз кімге арналған?",
    wish: "Тілек",
    wishPlaceholder: "Қолдау сөздерін жазыңыз",
    phone: "Сіздің телефон нөміріңіз",
    phonePlaceholder: "+ ел коды және нөмір",
    phoneHint: "Нөмірді ел кодымен енгізіңіз. SMS арқылы растау қажет емес.",
    readyPhrases: "Дайын тілекті таңдауға болады",
    requiredHint: "Үш өрісті де толтыру қажет",
    back: "Артқа",
    submit: "Тілекті жіберу",
    startOver: "Қайта бастау",
    successTitle: "ТІЛЕК ЖІБЕРІЛДІ!",
    successBody: "Қолдауыңызға рақмет!",
    home: "Басты экранға",
    savingTitle: "Тілек сақталып жатыр…",
    savingHint: "Қолданбаны жаппаңыз",
    replaceTitle: "Жазылған мәтінді ауыстырасыз ба?",
    replaceBody: "Тілек мәтіні таңдалған дайын тілекпен ауыстырылады.",
    replaceConfirm: "Ауыстыру",
    resetTitle: "Қайта бастайсыз ба?",
    resetBody: "Енгізілген деректер формадан өшіріледі.",
    resetConfirm: "Иә, қайта бастау",
    cancel: "Бас тарту",
    continue: "Толтыруды жалғастыру",
    idleTitle: "Сіз әлі осындасыз ба?",
    idleBody: (seconds) => `${seconds} секундтан кейін форма тазартылады.`,
    privacyDraft: "Деректер туралы мәтінді ұйымдастырушы бекітеді. Демода тек ойдан шығарылған деректерді пайдаланыңыз.",
    demoNotice: "UX-ДЕМО · ТЕК ТЕСТ ДЕРЕКТЕРІ",
    required: "Бұл өрісті толтырыңыз",
    nameLength: "2–120 таңба енгізіңіз",
    wishLength: "Тілек 1–200 таңбадан тұруы керек",
    phoneFormat: "+ белгісін және ел коды бар нөмірді енгізіңіз",
    fixFields: "Белгіленген өрістерді тексеріңіз",
    keyboard: { space: "Бос орын", backspace: "Өшіру", shift: "Регистр", next: "Келесі", done: "Дайын", layout: "Тіл" },
  },
  ru: {
    distanceTitle: "КАКУЮ ДИСТАНЦИЮ БЕЖИТ УЧАСТНИК?",
    headline: "ТВОИ СЛОВА ПОМОГУТ ДОБЕЖАТЬ",
    intro: "Оставь пожелание участнику марафона. Его могут включить в ролик поддержки.",
    formTitle: "ПОДДЕРЖИТЕ БЕГУНА",
    runnerName: "Имя и фамилия бегуна",
    runnerNamePlaceholder: "Для кого ваше пожелание?",
    wish: "Пожелание",
    wishPlaceholder: "Напишите слова поддержки",
    phone: "Ваш телефон",
    phonePlaceholder: "+ код страны и номер",
    phoneHint: "Введите номер с кодом страны. SMS-подтверждение не требуется.",
    readyPhrases: "Можно выбрать готовую фразу",
    requiredHint: "Все три поля обязательны",
    back: "Назад",
    submit: "Отправить пожелание",
    startOver: "Начать заново",
    successTitle: "ПОЖЕЛАНИЕ ОТПРАВЛЕНО!",
    successBody: "Спасибо за поддержку!",
    home: "На главный экран",
    savingTitle: "Сохраняем пожелание…",
    savingHint: "Не закрывайте приложение",
    replaceTitle: "Заменить написанное?",
    replaceBody: "Текст пожелания будет заменён выбранной фразой.",
    replaceConfirm: "Заменить",
    resetTitle: "Начать заново?",
    resetBody: "Введённые данные будут удалены из формы.",
    resetConfirm: "Да, начать заново",
    cancel: "Отмена",
    continue: "Продолжить заполнение",
    idleTitle: "Вы ещё здесь?",
    idleBody: (seconds) => `Через ${seconds} секунд форма очистится.`,
    privacyDraft: "Уведомление о данных согласует организатор. Для демо используйте только вымышленные данные.",
    demoNotice: "UX-ДЕМО · ТОЛЬКО ТЕСТОВЫЕ ДАННЫЕ",
    required: "Заполните это поле",
    nameLength: "Введите от 2 до 120 символов",
    wishLength: "Пожелание должно содержать от 1 до 200 символов",
    phoneFormat: "Введите + и номер с кодом страны",
    fixFields: "Проверьте отмеченные поля",
    keyboard: { space: "Пробел", backspace: "Удалить", shift: "Регистр", next: "Далее", done: "Готово", layout: "Раскладка" },
  },
  en: {
    distanceTitle: "WHICH DISTANCE IS THE RUNNER TAKING ON?",
    headline: "YOUR WORDS CAN HELP THEM REACH THE FINISH",
    intro: "Leave a message for a marathon runner. It may be included in a support video.",
    formTitle: "SUPPORT A RUNNER",
    runnerName: "Runner’s full name",
    runnerNamePlaceholder: "Who is your message for?",
    wish: "Your message",
    wishPlaceholder: "Write a few words of support",
    phone: "Your phone number",
    phonePlaceholder: "+ country code and number",
    phoneHint: "Include your country code. No SMS verification is required.",
    readyPhrases: "Or choose a ready-made message",
    requiredHint: "All three fields are required",
    back: "Back",
    submit: "Send message",
    startOver: "Start again",
    successTitle: "MESSAGE SENT!",
    successBody: "Thank you for your support!",
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
    privacyDraft: "The organizer must approve the data notice. Use fictional data in this demo only.",
    demoNotice: "UX DEMO · TEST DATA ONLY",
    required: "Complete this field",
    nameLength: "Enter between 2 and 120 characters",
    wishLength: "Your message must contain between 1 and 200 characters",
    phoneFormat: "Enter + and your number with its country code",
    fixFields: "Check the highlighted fields",
    keyboard: { space: "Space", backspace: "Delete", shift: "Shift", next: "Next", done: "Done", layout: "Layout" },
  },
};
