import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "./i18n/context";
import Wheel from "./components/Wheel/Wheel";
import MobileWheel from "./components/Wheel/MobileWheel";
import SpinButton from "./components/SpinButton/SpinButton";
import ResultModal from "./components/ResultModal/ResultModal";
import AuthorPanel from "./components/AuthorPanel/AuthorPanel";
import Confetti from "./components/Confetti/Confetti";
import { useConfetti } from "./components/Confetti/useConfetti";
import LanguageSwitcher from "./components/LanguageSwitcher/LanguageSwitcher";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import TermsPage from "./components/LegalPages/TermsPage";
import PrivacyPolicy from "./components/LegalPages/PrivacyPolicy";
import SEGMENT_DATA from "./components/Wheel/segments";
import "./App.css";

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPower, setSpinPower] = useState(0);
  const [resultIndex, setResultIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("wheel");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 600);
  const confettiRef = useRef(null);
  const modalTimeoutRef = useRef(null);

  // Detekcja mobile/desktop
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 600);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { launch: launchConfetti } = useConfetti(confettiRef);
  const { t } = useTranslation();

  // Czyszczenie timeoutu modala przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
    };
  }, []);

  // Pelne segmenty z tlumaczeniami
  const segments = useMemo(() => {
    const translatedSegments = t("segments");
    return SEGMENT_DATA.map((seg, i) => ({
      ...seg,
      text: translatedSegments[i]?.text ?? "",
      fullText: translatedSegments[i]?.fullText ?? "",
    }));
  }, [t]);

  const handleSpin = useCallback((power) => {
    if (isSpinning) return;
    setSpinPower(power);
    setIsSpinning(true);
    setShowModal(false);
    setResultIndex(null);
  }, [isSpinning]);

  const handleSpinComplete = useCallback(
    (index) => {
      setIsSpinning(false);
      setResultIndex(index);

      if (segments[index]?.isWinner) {
        launchConfetti();
      }

      // Czyszczenie poprzedniego timeoutu przed ustawieniem nowego
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
      modalTimeoutRef.current = setTimeout(() => {
        setShowModal(true);
        modalTimeoutRef.current = null;
      }, 400);
    },
    [segments, launchConfetti]
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Nawigacja do stron prawnych
  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleBackToWheel = useCallback(() => {
    setCurrentPage("wheel");
    window.scrollTo(0, 0);
  }, []);

  const resultSegment = resultIndex !== null ? segments[resultIndex] : null;

  // Strony prawne — renderowane zamiast glownej strony
  if (currentPage === "terms") {
    return (
      <>
        <LanguageSwitcher />
        <TermsPage onBack={handleBackToWheel} />
      </>
    );
  }

  if (currentPage === "privacy") {
    return (
      <>
        <LanguageSwitcher />
        <PrivacyPolicy onBack={handleBackToWheel} />
      </>
    );
  }

  // Glowna strona z kolem fortuny
  return (
    <>
      <LanguageSwitcher />
      <Confetti ref={confettiRef} />

      <div className="main-layout">
        <div className="wheel-section">
          {isMobile ? (
            <MobileWheel
              isSpinning={isSpinning}
              spinPower={spinPower}
              segments={segments}
              onSpinComplete={handleSpinComplete}
            />
          ) : (
            <Wheel
              isSpinning={isSpinning}
              spinPower={spinPower}
              segments={segments}
              onSpinComplete={handleSpinComplete}
            />
          )}
          <SpinButton disabled={isSpinning} onRelease={handleSpin} />
        </div>

        <div className="right-column">
          <AuthorPanel />
          <div className="legal-links">
            <button className="legal-link" onClick={() => handleNavigate("terms")}>
              {t("legal.footer.terms")}
            </button>
            <span className="legal-separator">|</span>
            <button className="legal-link" onClick={() => handleNavigate("privacy")}>
              {t("legal.footer.privacy")}
            </button>
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={showModal}
        onClose={handleCloseModal}
        segment={resultSegment}
        isWinner={resultSegment?.isWinner}
      />

      <CookieBanner onNavigate={handleNavigate} />
    </>
  );
}
