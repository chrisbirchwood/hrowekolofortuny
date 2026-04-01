import { useTranslation } from "../../i18n/context";
import "./LegalPages.css";

/**
 * Strona regulaminu serwisu.
 * Tresc pobierana z systemu tlumaczen (PL/EN).
 */
export default function TermsPage({ onBack }) {
  const { t } = useTranslation();

  return (
    <div className="legal-page">
      <button className="legal-page__back" onClick={onBack}>
        &larr; {t("legal.back")}
      </button>

      <h1>{t("legal.terms.title")}</h1>
      <span className="legal-page__date">{t("legal.terms.lastUpdated")}</span>

      <h2>{t("legal.terms.generalTitle")}</h2>
      <p>{t("legal.terms.generalText1")}</p>
      <p>{t("legal.terms.generalText2")}</p>

      <h2>{t("legal.terms.purposeTitle")}</h2>
      <p>{t("legal.terms.purposeText")}</p>

      <h2>{t("legal.terms.disclaimerTitle")}</h2>
      <p>{t("legal.terms.disclaimerText1")}</p>
      <p>{t("legal.terms.disclaimerText2")}</p>

      <h2>{t("legal.terms.ipTitle")}</h2>
      <p>{t("legal.terms.ipText")}</p>

      <h2>{t("legal.terms.liabilityTitle")}</h2>
      <p>{t("legal.terms.liabilityText")}</p>

      <h2>{t("legal.terms.lawTitle")}</h2>
      <p>{t("legal.terms.lawText")}</p>

      <h2>{t("legal.terms.contactTitle")}</h2>
      <div className="legal-page__contact">
        <p>{t("legal.terms.contactText")}</p>
      </div>
    </div>
  );
}
