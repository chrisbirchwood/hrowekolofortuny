import { useTranslation } from "../../i18n/context";
import "./LegalPages.css";

/**
 * Strona polityki prywatnosci.
 * Tresc pobierana z systemu tlumaczen (PL/EN).
 */
export default function PrivacyPolicy({ onBack }) {
  const { t } = useTranslation();

  return (
    <div className="legal-page">
      <button className="legal-page__back" onClick={onBack}>
        &larr; {t("legal.back")}
      </button>

      <h1>{t("legal.privacy.title")}</h1>
      <span className="legal-page__date">{t("legal.privacy.lastUpdated")}</span>

      <h2>{t("legal.privacy.controllerTitle")}</h2>
      <div className="legal-page__contact">
        <p>{t("legal.privacy.controllerText")}</p>
      </div>

      <h2>{t("legal.privacy.dataTitle")}</h2>
      <p>{t("legal.privacy.dataText")}</p>
      <ul>
        <li>{t("legal.privacy.dataItem1")}</li>
        <li>{t("legal.privacy.dataItem2")}</li>
      </ul>
      <p>{t("legal.privacy.dataNoPersonal")}</p>

      <h2>{t("legal.privacy.analyticsTitle")}</h2>
      <p>{t("legal.privacy.analyticsText")}</p>
      <ul>
        <li>{t("legal.privacy.analyticsItem1")}</li>
        <li>{t("legal.privacy.analyticsItem2")}</li>
        <li>{t("legal.privacy.analyticsItem3")}</li>
        <li>{t("legal.privacy.analyticsItem4")}</li>
      </ul>
      <p>{t("legal.privacy.analyticsText2")}</p>

      <h2>{t("legal.privacy.cookiesTitle")}</h2>
      <p>{t("legal.privacy.cookiesText")}</p>

      <h2>{t("legal.privacy.thirdPartyTitle")}</h2>
      <p>{t("legal.privacy.thirdPartyText")}</p>

      <h2>{t("legal.privacy.recruitmentTitle")}</h2>
      <p>{t("legal.privacy.recruitmentText")}</p>

      <h2>{t("legal.privacy.serverTitle")}</h2>
      <p>{t("legal.privacy.serverText")}</p>

      <h2>{t("legal.privacy.gdprTitle")}</h2>
      <p>{t("legal.privacy.gdprText")}</p>
      <ul>
        <li>{t("legal.privacy.gdprRight1")}</li>
        <li>{t("legal.privacy.gdprRight2")}</li>
        <li>{t("legal.privacy.gdprRight3")}</li>
        <li>{t("legal.privacy.gdprRight4")}</li>
        <li>{t("legal.privacy.gdprRight5")}</li>
      </ul>

      <h2>{t("legal.privacy.contactTitle")}</h2>
      <div className="legal-page__contact">
        <p>{t("legal.privacy.contactText")}</p>
      </div>
    </div>
  );
}
