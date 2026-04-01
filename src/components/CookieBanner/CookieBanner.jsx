import { useState, useEffect } from "react";
import { useTranslation } from "../../i18n/context";
import "./CookieBanner.css";

const GA_MEASUREMENT_ID = "G-10T7E9FDG2";

/**
 * Ladowanie Google Analytics - tylko po wyrazeniu zgody.
 * Tworzy skrypt gtag.js i konfiguruje z consent mode.
 */
function loadGoogleAnalytics() {
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
}

/**
 * Baner zgody na pliki cookie / localStorage.
 * Wyswietla sie przy pierwszej wizycie, zapisuje decyzje w localStorage.
 * GA laduje sie TYLKO po wyrazeniu pelnej zgody.
 */
export default function CookieBanner({ onNavigate }) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  // Sprawdzenie zgody przy pierwszym renderze
  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) {
        setIsVisible(true);
      } else if (consent === "all") {
        loadGoogleAnalytics();
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("cookie-consent", "all");
    } catch {}
    loadGoogleAnalytics();
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
