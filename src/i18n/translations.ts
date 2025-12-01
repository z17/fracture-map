export type Language = 'en' | 'ru';

export const translations = {
  en: {
    title: 'Fracture Map',
    subtitle: 'Mark your battle scars and share with friends',
    selected: 'Selected',
    selectBoneHint: 'Click on a bone to select',
    
    // Form
    addInjury: 'Add injury',
    injuryDescription: 'Injury description',
    addInjuryButton: 'Add injury',
    
    // List
    injuryHistory: 'Injury history',
    noInjuries: 'No injuries yet',
    selectBoneAndAdd: 'Select a bone and add an injury',
    save: 'Save',
    cancel: 'Cancel',
    editInjury: 'Edit injury',
    deleteInjury: 'Delete injury',
    
    // Loading
    loadingSkeleton: 'Loading skeleton...',
    
    // Months
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
  },
  ru: {
    title: 'Карта переломов',
    subtitle: 'Отмечай свои боевые травмы и делись с друзьями',
    selected: 'Выбрано',
    selectBoneHint: 'Кликните на кость для выбора',
    
    // Form
    addInjury: 'Добавить травму',
    injuryDescription: 'Описание травмы',
    addInjuryButton: 'Добавить травму',
    
    // List
    injuryHistory: 'История травм',
    noInjuries: 'Травм пока нет',
    selectBoneAndAdd: 'Выберите кость и добавьте травму',
    save: 'Сохранить',
    cancel: 'Отмена',
    editInjury: 'Редактировать травму',
    deleteInjury: 'Удалить травму',
    
    // Loading
    loadingSkeleton: 'Загрузка скелета...',
    
    // Months
    months: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

