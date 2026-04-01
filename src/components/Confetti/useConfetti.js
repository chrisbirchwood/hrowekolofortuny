import { useRef, useCallback, useEffect } from "react";

const COLORS = [
  "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE",
  "#F39C12", "#E74C3C", "#2ECC71", "#3498DB", "#FF69B4",
];

export function useConfetti(canvasRef) {
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const waveTimeoutsRef = useRef([]);

  // Czyszczenie timeoutow fal i animacji przy odmontowaniu
  useEffect(() => {
    return () => {
      waveTimeoutsRef.current.forEach((id) => clearTimeout(id));
      waveTimeoutsRef.current = [];
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  const launch = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    particlesRef.current = [];

    // Czyszczenie poprzednich timeoutow fal przed nowym uruchomieniem
    waveTimeoutsRef.current.forEach((id) => clearTimeout(id));
    waveTimeoutsRef.current = [];

    // Trzy fale confetti
    for (let wave = 0; wave < 3; wave++) {
      const timeoutId = setTimeout(() => {
        for (let i = 0; i < 80; i++) {
          particlesRef.current.push({
            x: Math.random() * canvas.width,
            y: -10 - Math.random() * 200,
            w: 4 + Math.random() * 8,
            h: 6 + Math.random() * 10,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            vx: (Math.random() - 0.5) * 6,
            vy: 2 + Math.random() * 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.03 + Math.random() * 0.05,
            opacity: 1,
            shape: Math.random() > 0.5 ? "rect" : "circle",
          });
        }
      }, wave * 400);
      waveTimeoutsRef.current.push(timeoutId);
    }

    function animate() {
      const particles = particlesRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.wobble) * 1.5;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        p.vy += 0.04;
        p.vx *= 0.99;

        if (p.y > canvas.height * 0.75) {
          p.opacity -= 0.02;
        }
        if (p.opacity <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      particlesRef.current = particles.filter(
        (p) => p.opacity > 0 && p.y < canvas.height + 50
      );

      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [canvasRef]);

  return { launch };
}
