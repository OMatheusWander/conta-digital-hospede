
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBRTranslations from './locales/pt-BR';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        translation: ptBRTranslations,
      },
    },
    lng: 'pt-BR', // Idioma padrão
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
