import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAudio } from "../hooks/useAudio";

describe("useAudio - hook dźwiękowy", () => {
  it("zwraca funkcje playTick, playWinSound, playFanfare", () => {
    const { result } = renderHook(() => useAudio());
    expect(typeof result.current.playTick).toBe("function");
    expect(typeof result.current.playWinSound).toBe("function");
    expect(typeof result.current.playFanfare).toBe("function");
  });

  it("playTick nie rzuca błędu gdy brak AudioContext", () => {
    const { result } = renderHook(() => useAudio());
    expect(() => result.current.playTick()).not.toThrow();
  });

  it("playWinSound nie rzuca błędu gdy brak AudioContext", () => {
    const { result } = renderHook(() => useAudio());
    expect(() => result.current.playWinSound()).not.toThrow();
  });

  it("playFanfare nie rzuca błędu gdy brak AudioContext", () => {
    const { result } = renderHook(() => useAudio());
    expect(() => result.current.playFanfare()).not.toThrow();
  });

  it("hook zwraca stabilne referencje (nie tworzy nowych funkcji)", () => {
    const { result, rerender } = renderHook(() => useAudio());
    const first = result.current;
    rerender();
    expect(result.current.playTick).toBe(first.playTick);
    expect(result.current.playWinSound).toBe(first.playWinSound);
    expect(result.current.playFanfare).toBe(first.playFanfare);
  });
});
