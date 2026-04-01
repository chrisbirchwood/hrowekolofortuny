import { useEffect, useRef } from "react";
import { useTranslation } from "../../i18n/context";
import "./ResultModal.css";

export default function ResultModal({ isOpen, onClose, segment, isWinner }) {
  const { t } = useTranslation();
  const closeRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeRef.current) {
      closeRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !segment) return null;

  const fullText = segment.fullText;
  const shareText = t("shareTemplate").replace("{result}", fullText);
  const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;

  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      aria-describedby="modalText"
    >
      <div className="modal-content">
        <h2 id="modalTitle">
          {isWinner ? t("modalTitleWinner") : t("modalTitle")}
        </h2>
        <div
          id="modalText"
          className={`result-text ${isWinner ? "winner" : ""}`}
        >
          {fullText}
        </div>
        <div className="modal-actions">
          <button className="modal-close" ref={closeRef} onClick={onClose}>
            {t("closeButton")}
          </button>
          <a
            className="linkedin-share"
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            {t("shareLinkedIn")}
          </a>
        </div>
      </div>
    </div>
  );
}
