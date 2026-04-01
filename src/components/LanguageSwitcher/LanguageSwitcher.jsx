import { useTranslation } from "../../i18n/context";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="language-switcher" role="radiogroup" aria-label="Language">
      <button
        className={`lang-btn ${lang === "pl" ? "active" : ""}`}
        onClick={() => setLang("pl")}
        role="radio"
        aria-checked={lang === "pl"}
      >
        PL
      </button>
      <button
        className={`lang-btn ${lang === "en" ? "active" : ""}`}
        onClick={() => setLang("en")}
        role="radio"
        aria-checked={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
