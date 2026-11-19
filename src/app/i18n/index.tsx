
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import general from "@/locales/en/general.json";
import checkout from "@/locales/en/checkout.json";
import onboarding from "@/locales/en/onboarding.json";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: general,
            checkout,
            onboarding
        },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
