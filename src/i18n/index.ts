import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        sports: "Sports",
        reco: "Recommandations",
        chat: "Chat",
        login: "Connexion",
        register: "S'inscrire",
      },
      home: {
        badge: "Nouvelle saison · Bien-être actif",
        title: "Bouge sainement, à ton rythme",
        subtitle:
          "SportConnectIA t’accompagne pour démarrer (ou reprendre) une vie active de façon simple, motivante et personnalisée.",
        register: "Créer mon compte",
        login: "Se connecter",
        disclaimer: "En te connectant, tu acceptes nos conditions d’utilisation.",
        benefits: "Les bénéfices de la plateforme",
        b1title: "Plan actif personnalisé",
        b1text: "Rutines adaptées à ton niveau, avec suivi simple.",
        b2title: "Recommandations IA",
        b2text: "Conseils basés sur tes progrès et préférences.",
        b3title: "Défis et motivation",
        b3text: "Défis hebdomadaires, badges et rappels bienveillants.",
        b4title: "Ta santé, d'abord",
        b4text: "Bonnes pratiques et alertes pour t'entraîner en sécurité.",
        footer: "Projet réalisé pour l’Institut Teccart — Automne 2025",
      },
      pages: {
        login: { title: "Connexion", cta: "Se connecter" },
        register: { title: "Créer un compte", cta: "S'inscrire" },
        sports: { title: "Explorer les sports" },
        reco: { title: "Vos recommandations" },
        chat: { title: "Chat de coaching" },
        notfound: { title: "Page introuvable" },
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        sports: "Sports",
        reco: "Recommendations",
        chat: "Chat",
        login: "Login",
        register: "Sign up",
      },
      home: {
        badge: "New season · Active lifestyle",
        title: "Move healthy, at your own pace",
        subtitle:
          "SportConnectIA helps you start (or resume) an active life in a simple, motivating, and personalized way.",
        register: "Create my account",
        login: "Log in",
        disclaimer: "By logging in, you agree to our terms of service.",
        benefits: "Platform benefits",
        b1title: "Personalized active plan",
        b1text: "Routines adapted to your level, with simple tracking.",
        b2title: "AI recommendations",
        b2text: "Advice based on your progress and preferences.",
        b3title: "Challenges and motivation",
        b3text: "Weekly challenges, badges, and gentle reminders.",
        b4title: "Your health first",
        b4text: "Good practices and alerts for safe training.",
        footer: "Project carried out for Institut Teccart — Fall 2025",
      },
      pages: {
        login: { title: "Login", cta: "Log in" },
        register: { title: "Create account", cta: "Sign up" },
        sports: { title: "Explore sports" },
        reco: { title: "Your recommendations" },
        chat: { title: "Coaching chat" },
        notfound: { title: "Page not found" },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
