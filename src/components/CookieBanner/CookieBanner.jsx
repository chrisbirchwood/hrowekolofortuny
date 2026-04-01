import { useState, useEffect } from "react";
import { useTranslation } from "../../i18n/context";
import "./CookieBanner.css";

/**
 * Baner zgody na pliki cookie / localStorage.
 * Wyswietla sie przy pierwszej wizycie, zapisuje decyzje w localStorage.
 */
export default function CookieBanner({ onNavigate }) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // Brak dostepu do localStorage — nie pokazujemy banera
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("cookie-consent", "all");
    } catch {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem("cookie-consent", "essential");
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label={t("legal.cookie.title")}>
      <div className="cookie-banner__content">
        <p className="cookie-banner__text">
          {t("legal.cookie.message")}{" "}
          <button
            className="cookie-banner__link"
            onClick={() => onNavigate("privacy")}
          >
            {t("legal.cookie.privacyLink")}
          </button>{" "}
          {t("legal.cookie.and")}{" "}
          <button
            className="cookie-banner__link"
            onClick={() => onNavigate("terms")}
          >
            {t("legal.cookie.termsLink")}
          </button>
          .
        </p>
        <div className="cookie-banner__buttons">
          <button className="cookie-banner__btn cookie-banner__btn--accept" onClick={handleAccept}>
            {t("legal.cookie.acceptAll")}
          </button>
          <button className="cookie-banner__btn cookie-banner__btn--essential" onClick={handleEssentialOnly}>
            {t("legal.cookie.essentialOnly")}
          </button>
        </div>
      </div>
    </div>
  );
}
