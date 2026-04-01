import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "../../i18n/context";
import "./SpinButton.css";

// Maksymalny czas trzymania ktory sie liczy (ms)
const MAX_HOLD_TIME = 3000;

export default function SpinButton({ disabled, onRelease }) {
  const { t } = useTranslation();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdStartRef = useRef(null);
  const rafRef = useRef(null);
  const activeRef = useRef(false);

  // Animacja paska postepu podczas trzymania
  useEffect(() => {
    if (!holding) {
      setProgress(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    function tick() {
      if (!holdStartRef.current) return;
      const elapsed = performance.now() - holdStartRef.current;
      setProgress(Math.min(elapsed / MAX_HOLD_TIME, 1));
      if (elapsed < MAX_HOLD_TIME) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [holding]);

  const startHold = useCallback(() => {
    if (disabled || activeRef.current) return;
    activeRef.current = true;
    holdStartRef.current = performance.now();
    setHolding(true);
  }, [disabled]);

  const endHold = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;

    const start = holdStartRef.current;
    holdStartRef.current = null;
    setHolding(false);

    if (!start || disabled) return;
    const holdDuration = Math.min(performance.now() - start, MAX_HOLD_TIME);
    const power = holdDuration / MAX_HOLD_TIME;
    onRelease(power);
  }, [disabled, onRelease]);

  const cancelHold = useCallback(() => {
    activeRef.current = false;
    holdStartRef.current = null;
    setHolding(false);
  }, []);

  // Globalny mouseup/touchend - zlapie puszczenie nawet poza przyciskiem
  useEffect(() => {
    window.addEventListener("mouseup", endHold);
    window.addEventListener("touchend", endHold);
    return () => {
      window.removeEventListener("mouseup", endHold);
      window.removeEventListener("touchend", endHold);
    };
  }, [endHold]);

  const percent = Math.round(progress * 100);

  return (
    <div className="spin-button-wrapper">
      <button
        className={`spin-button ${holding ? "holding" : ""}`}
        disabled={disabled}
        onMouseDown={startHold}
        onTouchStart={startHold}
        onContextMenu={(e) => { e.preventDefault(); cancelHold(); }}
        style={{
          "--progress": `${progress * 100}%`,
        }}
      >
        {disabled
          ? t("spinButton")
          : holding
            ? `${percent}%`
            : t("spinButton")}
      </button>
      <div className="spin-hint">
        {!disabled && t("spinHint")}
      </div>
    </div>
  );
}
