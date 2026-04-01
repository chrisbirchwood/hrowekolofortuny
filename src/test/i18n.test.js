import { describe, it, expect } from "vitest";
import pl from "../i18n/pl";
import en from "../i18n/en";
import SEGMENT_DATA from "../components/Wheel/segments";

describe("i18n - spójność tłumaczeń", () => {
  it("PL i EN mają tę samą liczbę segmentów", () => {
    expect(pl.segments.length).toBe(en.segments.length);
  });

  it("segmenty i18n odpowiadają danym segmentów (kolory)", () => {
    expect(pl.segments.length).toBe(SEGMENT_DATA.length);
    expect(en.segments.length).toBe(SEGMENT_DATA.length);
  });

  it("każdy segment PL ma text i fullText", () => {
    pl.segments.forEach((seg, i) => {
      expect(seg.text, `segment PL[${i}] brak text`).toBeTruthy();
      expect(seg.fullText, `segment PL[${i}] brak fullText`).toBeTruthy();
    });
  });

  it("każdy segment EN ma text i fullText", () => {
    en.segments.forEach((seg, i) => {
      expect(seg.text, `segment EN[${i}] brak text`).toBeTruthy();
      expect(seg.fullText, `segment EN[${i}] brak fullText`).toBeTruthy();
    });
  });

  it("segment ZATRUDNIONY/HIRED jest na tej samej pozycji w obu językach", () => {
    const plWinner = SEGMENT_DATA.findIndex((s) => s.isWinner);
    expect(plWinner).toBeGreaterThan(-1);
    expect(pl.segments[plWinner].fullText).toContain("ZATRUDNIONY");
    expect(en.segments[plWinner].fullText).toContain("HIRED");
  });

  it("PL i EN mają te same klucze najwyższego poziomu", () => {
    const plKeys = Object.keys(pl).sort();
    const enKeys = Object.keys(en).sort();
    expect(plKeys).toEqual(enKeys);
  });

  it("PL i EN legal mają te same klucze", () => {
    const plKeys = Object.keys(pl.legal).sort();
    const enKeys = Object.keys(en.legal).sort();
    expect(plKeys).toEqual(enKeys);
  });

  it("PL i EN author mają te same klucze", () => {
    const plKeys = Object.keys(pl.author).sort();
    const enKeys = Object.keys(en.author).sort();
    expect(plKeys).toEqual(enKeys);
  });
});

describe("i18n - treść tłumaczeń", () => {
  it("shareTemplate zawiera placeholder {result}", () => {
    expect(pl.shareTemplate).toContain("{result}");
    expect(en.shareTemplate).toContain("{result}");
  });

  it("tytuł PL jest po polsku", () => {
    expect(pl.title).toBe("Rekrutacyjne");
    expect(pl.titleLine2).toContain("Koło");
  });

  it("tytuł EN jest po angielsku", () => {
    expect(en.title).toBe("Recruitment");
    expect(en.titleLine2).toContain("Wheel");
  });
});
