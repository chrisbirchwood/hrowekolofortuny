import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "../../i18n/context";
import { useAudio } from "../../hooks/useAudio";
import "./Wheel.css";

export default function Wheel({ isSpinning, spinPower = 0.5, segments, onSpinComplete }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const spinningRef = useRef(false);
  const spinRafRef = useRef(null);
  // Refy zapobiegajace stalym domknieciam w animacji
  const onSpinCompleteRef = useRef(onSpinComplete);
  const segmentsRef = useRef(segments);
  const { t, lang } = useTranslation();
  const { playTick, playWinSound, playFanfare } = useAudio();

  // Aktualizacja refow przy kazdej zmianie propsow
  useEffect(() => { onSpinCompleteRef.current = onSpinComplete; }, [onSpinComplete]);
  useEffect(() => { segmentsRef.current = segments; }, [segments]);

  const segmentCount = segments.length;
  const arc = (2 * Math.PI) / segmentCount;

  // Obliczanie rozmiaru canvasa
  const calculateSize = useCallback(() => {
    const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 200, 650);
    return Math.max(maxSize, 320);
  }, []);

  // Dobieranie koloru tekstu
  const getTextColor = useCallback((hexColor, isWinner) => {
    if (isWinner) return "#000";
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55 ? "#1a1a2e" : "#ffffff";
  }, []);

  // Rysowanie calego kola
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    // Rozmiar logiczny — canvas.width/height juz zawiera DPR
    const size = canvas.width / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRingWidth = size * 0.025;
    const radius = size / 2 - outerRingWidth - 4;
    const innerRadius = radius * 0.22;
    const currentAngle = angleRef.current;

    ctx.clearRect(0, 0, size, size);

    // Metaliczny pierscien zewnetrzny
    const outerRadius = size / 2 - 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.arc(centerX, centerY, outerRadius - outerRingWidth, 0, 2 * Math.PI, true);
    ctx.closePath();
    const ringGrad = ctx.createLinearGradient(0, 0, size, size);
    ringGrad.addColorStop(0, "#C0C0C0");
    ringGrad.addColorStop(0.3, "#E8E8E8");
    ringGrad.addColorStop(0.5, "#A0A0A0");
    ringGrad.addColorStop(0.7, "#D0D0D0");
    ringGrad.addColorStop(1, "#909090");
    ctx.fillStyle = ringGrad;
    ctx.fill();

    // Sruby dekoracyjne
    const boltRadius = outerRingWidth * 0.25;
    const boltDistance = outerRadius - outerRingWidth / 2;
    for (let i = 0; i < 36; i++) {
      const angle = (2 * Math.PI / 36) * i;
      const bx = centerX + Math.cos(angle) * boltDistance;
      const by = centerY + Math.sin(angle) * boltDistance;
      ctx.beginPath();
      ctx.arc(bx, by, boltRadius, 0, 2 * Math.PI);
      const boltGrad = ctx.createRadialGradient(bx - 1, by - 1, 0, bx, by, boltRadius);
      boltGrad.addColorStop(0, "#fff");
      boltGrad.addColorStop(1, "#888");
      ctx.fillStyle = boltGrad;
      ctx.fill();
    }

    // Segmenty
    for (let i = 0; i < segmentCount; i++) {
      const seg = segments[i];
      const startAngle = currentAngle + i * arc;
      const endAngle = startAngle + arc;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      if (seg.isWinner) {
        const grad = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, radius);
        grad.addColorStop(0, "#FFD700");
        grad.addColorStop(0.5, "#FFC107");
        grad.addColorStop(1, "#FF8F00");
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = seg.color;
      }
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tekst na segmencie
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + arc / 2);

      const textColor = getTextColor(seg.color, seg.isWinner);
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const lines = seg.text.split("\n");
      const maxLines = lines.length;
      const baseSize = size * 0.018;
      let fontSize;
      if (maxLines <= 2) fontSize = baseSize * 1.1;
      else if (maxLines <= 3) fontSize = baseSize * 0.95;
      else if (maxLines <= 4) fontSize = baseSize * 0.85;
      else fontSize = baseSize * 0.75;

      ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`;
      const textRadius = innerRadius + (radius - innerRadius) * 0.55;
      const lineHeight = fontSize * 1.15;
      const totalHeight = lines.length * lineHeight;
      const startY = -totalHeight / 2 + lineHeight / 2;

      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      lines.forEach((line, li) => {
        ctx.fillText(line, textRadius, startY + li * lineHeight, radius * 0.45);
      });

      ctx.restore();
      ctx.restore();
    }

    // Centralne kolo
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius + 4, 0, 2 * Math.PI);
    const goldGrad = ctx.createLinearGradient(
      centerX - innerRadius, centerY - innerRadius,
      centerX + innerRadius, centerY + innerRadius
    );
    goldGrad.addColorStop(0, "#FFD700");
    goldGrad.addColorStop(0.3, "#FFF8DC");
    goldGrad.addColorStop(0.5, "#DAA520");
    goldGrad.addColorStop(0.7, "#FFD700");
    goldGrad.addColorStop(1, "#B8860B");
    ctx.fillStyle = goldGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#111";
    ctx.fill();

    // Tytul w srodku
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const titleSize = Math.max(size * 0.028, 11);
    ctx.font = `900 ${titleSize}px 'Segoe UI', sans-serif`;
    ctx.fillText(t("title"), centerX, centerY - titleSize * 1.1);
    ctx.fillText(t("titleLine2"), centerX, centerY - titleSize * 0.05);

    const subSize = Math.max(size * 0.014, 7);
    ctx.font = `${subSize}px 'Segoe UI', sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.7)";

    // Zawijanie tekstu podtytulu
    const subtitle = t("subtitle");
    const words = subtitle.split(" ");
    let line = "";
    let currentY = centerY + titleSize * 1.0;
    const maxWidth = innerRadius * 1.6;
    words.forEach((word) => {
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > maxWidth && line !== "") {
        ctx.fillText(line.trim(), centerX, currentY);
        line = word + " ";
        currentY += subSize * 1.2;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line.trim(), centerX, currentY);
  }, [segments, segmentCount, arc, getTextColor, t]);

  // Inicjalizacja + resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const size = calculateSize();
      const dpr = window.devicePixelRatio || 1;
      // Ustawiamy fizyczny rozmiar canvasa z uwzglednieniem DPR
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + "px";
      canvas.style.height = size + "px";
      drawWheel();
    }

    resize();

    let resizeTimeout;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [calculateSize, drawWheel]);

  // Przerysuj przy zmianie jezyka (gdy nie kreci sie)
  useEffect(() => {
    if (!spinningRef.current) {
      drawWheel();
    }
  }, [lang, drawWheel]);

  // Animacja krecenia
  useEffect(() => {
    if (!isSpinning || spinningRef.current) return;
    spinningRef.current = true;

    // Sila krecenia wplywa na ilosc obrotow i czas trwania
    // power 0..1 -> obroty 3..10, czas 2.5..6.5s
    const minRotations = 3 + spinPower * 5;
    const extraRotations = Math.random() * 2;
    const totalRotation = (minRotations + extraRotations) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 2500 + spinPower * 3000 + Math.random() * 1000;
    const startAngle = angleRef.current;
    const startTime = performance.now();
    let lastTickSegment = -1;
    let cancelled = false;

    function animate(now) {
      if (cancelled) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3.5);

      angleRef.current = startAngle + totalRotation * eased;

      // Tykanie
      const normalizedAngle = ((2 * Math.PI - (angleRef.current % (2 * Math.PI))) + (2 * Math.PI)) % (2 * Math.PI);
      const currentTickSegment = Math.floor(normalizedAngle / arc);
      if (currentTickSegment !== lastTickSegment) {
        lastTickSegment = currentTickSegment;
        if (progress < 0.95) playTick();
      }

      drawWheel();

      if (progress < 1) {
        spinRafRef.current = requestAnimationFrame(animate);
      } else {
        spinRafRef.current = null;
        spinningRef.current = false;
        const finalAngle = angleRef.current % (2 * Math.PI);
        const pointerAngle = (3 * Math.PI / 2 - finalAngle + 4 * Math.PI) % (2 * Math.PI);
        // Uzycie refow zamiast domkniec — zapobiega stalym wartosciom
        const currentSegments = segmentsRef.current;
        const count = currentSegments.length;
        const segArc = (2 * Math.PI) / count;
        const winningIndex = Math.floor(pointerAngle / segArc) % count;
        const winner = currentSegments[winningIndex];

        if (winner.isWinner) {
          playFanfare();
        } else {
          playWinSound();
        }

        onSpinCompleteRef.current(winningIndex);
      }
    }

    spinRafRef.current = requestAnimationFrame(animate);

    // Czyszczenie rAF przy odmontowaniu lub zmianie efektu
    return () => {
      cancelled = true;
      if (spinRafRef.current) {
        cancelAnimationFrame(spinRafRef.current);
        spinRafRef.current = null;
      }
    };
  }, [isSpinning, spinPower, arc, drawWheel, playTick, playWinSound, playFanfare]);

  return (
    <div className="wheel-container">
      <svg className="pointer" width="40" height="50" viewBox="0 0 40 50">
        <polygon points="20,45 4,5 36,5" fill="#fff" stroke="#ccc" strokeWidth="1.5" />
        <circle cx="20" cy="12" r="5" fill="#e63946" />
      </svg>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${t("title")} ${t("titleLine2")}`}
      />
    </div>
  );
}
