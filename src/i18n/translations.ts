export type Language = 'en' | 'ru';

export const translations = {
  en: {
    title: 'Fracture Map',
    subtitle: 'Mark your scars and share with friends',
    selected: 'Selected',
    selectBoneHint: 'Click on a bone to select',

    addInjury: 'Add injury',
    injuryDescription: 'Injury description',
    addInjuryButton: 'Add injury',
    injuryHistory: 'Injury history',
    noInjuries: 'No injuries yet',
    selectBoneAndAdd: 'Select a bone and add an injury',
    save: 'Save',
    cancel: 'Cancel',
    editInjury: 'Edit injury',
    deleteInjury: 'Delete injury',
    loadingSkeleton: 'Loading skeleton...',

    statsTitle: 'Statistics',
    totalInjuries: 'Total injuries',
    bonesInjured: 'Bones injured',
    percentInjured: 'Percent injured',
    outOf: 'of',

    shareTitle: 'Share',
    mapName: 'Map name',
    mapNamePlaceholder: 'My fracture map',
    generateLink: 'Generate link',
    saveMap: 'Save',
    viewLink: 'View link',
    editLink: 'Secret edit link',
    copy: 'Copy',
    copied: 'Copied!',
    downloadImage: 'Download image',

    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
  },
  ru: {
    title: 'Карта переломов',
    subtitle: 'Отмечай свои травмы и делись с друзьями',
    selected: 'Выбрано',
    selectBoneHint: 'Кликните на кость для выбора',
    addInjury: 'Добавить травму',
    injuryDescription: 'Описание травмы',
    addInjuryButton: 'Добавить травму',
    injuryHistory: 'История травм',
    noInjuries: 'Травм пока нет',
    selectBoneAndAdd: 'Выберите кость и добавьте травму',
    save: 'Сохранить',
    cancel: 'Отмена',
    editInjury: 'Редактировать травму',
    deleteInjury: 'Удалить травму',
    loadingSkeleton: 'Загрузка скелета...',

    statsTitle: 'Статистика',
    totalInjuries: 'Всего травм',
    bonesInjured: 'Костей сломано',
    percentInjured: 'Процент повреждений',
    outOf: 'из',

    shareTitle: 'Поделиться',
    mapName: 'Название карты',
    mapNamePlaceholder: 'Моя карта переломов',
    generateLink: 'Сгенерировать ссылку',
    saveMap: 'Сохранить',
    viewLink: 'Ссылка для просмотра',
    editLink: 'Секретная ссылка для редактирования',
    copy: 'Копировать',
    copied: 'Скопировано!',
    downloadImage: 'Скачать изображение',

    months: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

