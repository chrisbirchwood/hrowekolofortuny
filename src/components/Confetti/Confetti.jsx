import { forwardRef } from "react";
import "./Confetti.css";

const Confetti = forwardRef(function Confetti(_, ref) {
  return <canvas ref={ref} className="confetti-canvas" />;
});

export default Confetti;
