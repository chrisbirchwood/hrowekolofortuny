import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "../../i18n/context";
import { useAudio } from "../../hooks/useAudio";
import "./MobileWheel.css";

/*
  Mobilny widok kola fortuny - poziome paski przesuwajace sie pionowo.
  Strzalka wskazuje na srodkowy pasek. Widoczne 3-5 segmentow naraz.
*/

const VISIBLE_ITEMS = 5;
const ITEM_HEIGHT = 64;
const TOTAL_HEIGHT = VISIBLE_ITEMS * ITEM_HEIGHT;

export default function MobileWheel({ isSpinning, spinPower = 0.5, segments, onSpinComplete }) {
  const containerRef = useRef(null);
  const offsetRef = useRef(0);
  const spinningRef = useRef(false);
  const rafRef = useRef(null);
  const { t } = useTranslation();
  const { playTick, playWinSound, playFanfare } = useAudio();

  const segmentsRef = useRef(segments);
  useEffect(() => { segmentsRef.current = segments; }, [segments]);

  const onSpinCompleteRef = useRef(onSpinComplete);
  useEffect(() => { onSpinCompleteRef.current = onSpinComplete; }, [onSpinComplete]);

  const segmentCount = segments.length;

  // Rysowanie paskow - czyta segments z closure, nie z ref
  const draw = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const segs = segments;
    const count = segs.length;
    const offset = offsetRef.current;

    // Wyczyszczenie
    const items = container.querySelectorAll(".mobile-strip-item");
    const totalSlots = VISIBLE_ITEMS + 2; // dodatkowe na gorze i dole dla plynnosci

    // Oblicz ktory segment jest na srodku
    const centerIndex = Math.floor(offset / ITEM_HEIGHT) % count;
    const fractional = offset % ITEM_HEIGHT;

    for (let i = 0; i < totalSlots; i++) {
      const slotOffset = i - Math.floor(totalSlots / 2);
      let segIndex = ((centerIndex + slotOffset) % count + count) % count;
      const seg = segs[segIndex];
      const item = items[i];
      if (!item) continue;

      item.style.transform = `translateY(${slotOffset * ITEM_HEIGHT - fractional + TOTAL_HEIGHT / 2 - ITEM_HEIGHT / 2}px)`;
      item.style.background = seg.color;
      item.querySelector(".mobile-strip-text").textContent = seg.fullText;

      // Kolor tekstu
      const r = parseInt(seg.color.slice(1, 3), 16);
      const g = parseInt(seg.color.slice(3, 5), 16);
      const b = parseInt(seg.color.slice(5, 7), 16);
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      item.querySelector(".mobile-strip-text").style.color = (seg.isWinner || lum > 0.55) ? "#1a1a2e" : "#fff";

      // Zloty border dla ZATRUDNIONY
      if (seg.isWinner) {
        item.style.background = "linear-gradient(90deg, #FFD700, #FFC107, #FF8F00)";
        item.querySelector(".mobile-strip-text").style.fontWeight = "900";
      } else {
        item.querySelector(".mobile-strip-text").style.fontWeight = "700";
      }

      // Opacity - srodkowy jasny, krawedzie przygaszone
      const distFromCenter = Math.abs(slotOffset * ITEM_HEIGHT - fractional);
      const opacity = Math.max(0.3, 1 - distFromCenter / (TOTAL_HEIGHT * 0.5));
      item.style.opacity = opacity;
    }
  }, [segments]);

  // Inicjalizacja
  useEffect(() => {
    draw();
  }, [draw, segments]);

  // Animacja krecenia
  useEffect(() => {
    if (!isSpinning || spinningRef.current) return;
    spinningRef.current = true;

    const totalItems = 30 + Math.floor(spinPower * 40) + Math.floor(Math.random() * 15);
    const totalDistance = totalItems * ITEM_HEIGHT + Math.random() * ITEM_HEIGHT;
    const duration = 2500 + spinPower * 3000 + Math.random() * 1000;
    const startOffset = offsetRef.current;
    const startTime = performance.now();
    let lastTickItem = -1;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3.5);

      offsetRef.current = startOffset + totalDistance * eased;

      // Tykanie
      const currentItem = Math.floor(offsetRef.current / ITEM_HEIGHT);
      if (currentItem !== lastTickItem) {
        lastTickItem = currentItem;
        if (progress < 0.95) playTick();
      }

      draw();

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        spinningRef.current = false;
        const segs = segmentsRef.current;
        const winningIndex = Math.floor(offsetRef.current / ITEM_HEIGHT) % segs.length;

        if (segs[winningIndex].isWinner) {
          playFanfare();
        } else {
          playWinSound();
        }

        onSpinCompleteRef.current(winningIndex);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      spinningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isSpinning, spinPower, segmentCount, draw, playTick, playWinSound, playFanfare]);

  // Generowanie slotow DOM
  const totalSlots = VISIBLE_ITEMS + 2;

  return (
    <div className="mobile-wheel">
      <div className="mobile-strip-wrapper">
        {/* Strzalka po lewej */}
        <div className="mobile-pointer">
          <svg width="24" height="30" viewBox="0 0 24 30">
            <polygon points="0,15 24,4 24,26" fill="#fff" stroke="#ccc" strokeWidth="1" />
            <circle cx="20" cy="15" r="3" fill="#e63946" />
          </svg>
        </div>

        <div
          className="mobile-strip-container"
          ref={containerRef}
          style={{ height: TOTAL_HEIGHT }}
        >
          {Array.from({ length: totalSlots }).map((_, i) => (
            <div key={i} className="mobile-strip-item">
              <span className="mobile-strip-text" />
            </div>
          ))}
        </div>

        {/* Strzalka po prawej */}
        <div className="mobile-pointer mobile-pointer--right">
          <svg width="24" height="30" viewBox="0 0 24 30">
            <polygon points="24,15 0,4 0,26" fill="#fff" stroke="#ccc" strokeWidth="1" />
            <circle cx="4" cy="15" r="3" fill="#e63946" />
          </svg>
        </div>
      </div>

      {/* Tytul pod paskami */}
      <div className="mobile-wheel-title">
        <span className="mobile-wheel-title__main">{t("title")} {t("titleLine2")}</span>
        <span className="mobile-wheel-title__sub">{t("subtitle")}</span>
      </div>
    </div>
  );
}
