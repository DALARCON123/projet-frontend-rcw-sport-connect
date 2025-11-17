import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./locales/fr.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      es: { translation: es },
      pt: { translation: pt }
    },
    lng: "fr",            // idioma por defecto
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false
    },
    // dejamos el separador por defecto ".", así funciona nav.home y home.hero.title_1
    keySeparator: "."
  });

export default i18n;
