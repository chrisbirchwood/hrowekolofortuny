import { describe, it, expect } from "vitest";
import SEGMENT_DATA from "../components/Wheel/segments";

describe("Segment data - dane segmentów koła", () => {
  it("jest dokładnie 18 segmentów", () => {
    expect(SEGMENT_DATA.length).toBe(18);
  });

  it("każdy segment ma kolor w formacie hex", () => {
    SEGMENT_DATA.forEach((seg, i) => {
      expect(seg.color, `segment[${i}] brak koloru hex`).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it("dokładnie jeden segment jest zwycięski (isWinner)", () => {
    const winners = SEGMENT_DATA.filter((s) => s.isWinner);
    expect(winners.length).toBe(1);
  });

  it("zwycięski segment ma złoty kolor", () => {
    const winner = SEGMENT_DATA.find((s) => s.isWinner);
    expect(winner.color).toBe("#FFD700");
  });

  it("wszystkie kolory są unikalne", () => {
    const colors = SEGMENT_DATA.map((s) => s.color);
    const unique = new Set(colors);
    expect(unique.size).toBe(colors.length);
  });
});
