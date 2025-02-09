import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';

i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    defaultNS: 'common',
    keySeparator: 'false',
    ns: [...Object.keys(en)],
    resources: {
      en,
    },
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  })
  .then(() => {});
