import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../i18n/context";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import SpinButton from "../components/SpinButton/SpinButton";
import AuthorPanel from "../components/AuthorPanel/AuthorPanel";

beforeEach(() => {
  localStorage.clear();
});

// Wrapper z providerem i18n
function renderWithI18n(component) {
  return render(<LanguageProvider>{component}</LanguageProvider>);
}

describe("LanguageSwitcher", () => {
  it("renderuje przyciski PL i EN", () => {
    renderWithI18n(<LanguageSwitcher />);
    expect(screen.getByText("PL")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("PL jest domyślnie aktywny", () => {
    renderWithI18n(<LanguageSwitcher />);
    const plBtn = screen.getByText("PL");
    expect(plBtn).toHaveAttribute("aria-checked", "true");
  });

  it("kliknięcie EN zmienia język", () => {
    renderWithI18n(<LanguageSwitcher />);
    fireEvent.click(screen.getByText("EN"));
    expect(screen.getByText("EN")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("PL")).toHaveAttribute("aria-checked", "false");
  });
});

describe("SpinButton", () => {
  it("renderuje przycisk z tekstem", () => {
    renderWithI18n(<SpinButton disabled={false} onRelease={vi.fn()} />);
    // Domyslnie PL
    expect(screen.getByRole("button")).toHaveTextContent("ZAKRĘĆ!");
  });

  it("przycisk jest wyłączony gdy disabled=true", () => {
    renderWithI18n(<SpinButton disabled={true} onRelease={vi.fn()} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("wyświetla podpowiedź gdy nie jest disabled", () => {
    renderWithI18n(<SpinButton disabled={false} onRelease={vi.fn()} />);
    expect(screen.getByText(/Przytrzymaj/)).toBeInTheDocument();
  });

  it("nie wyświetla podpowiedzi gdy jest disabled", () => {
    renderWithI18n(<SpinButton disabled={true} onRelease={vi.fn()} />);
    expect(screen.queryByText(/Przytrzymaj/)).not.toBeInTheDocument();
  });
});

describe("AuthorPanel", () => {
  it("renderuje imię i nazwisko autora", () => {
    renderWithI18n(<AuthorPanel />);
    expect(screen.getByText("Krzysztof Brzezina")).toBeInTheDocument();
  });

  it("renderuje linki kontaktowe", () => {
    renderWithI18n(<AuthorPanel />);
    expect(screen.getByText("krzysztofbrzezina")).toBeInTheDocument();
    expect(screen.getByText("chrisbirchwood.info@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("+48 500 435 697")).toBeInTheDocument();
    expect(screen.getByText("chrisbirchwood")).toBeInTheDocument();
  });

  it("link do LinkedIn prowadzi pod właściwy URL", () => {
    renderWithI18n(<AuthorPanel />);
    const linkedinLink = screen.getByText("krzysztofbrzezina").closest("a");
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/krzysztofbrzezina/"
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("linki email i telefon mają poprawne schematy", () => {
    renderWithI18n(<AuthorPanel />);
    const emailLink = screen.getByText("chrisbirchwood.info@gmail.com").closest("a");
    expect(emailLink).toHaveAttribute("href", "mailto:chrisbirchwood.info@gmail.com");

    const phoneLink = screen.getByText("+48 500 435 697").closest("a");
    expect(phoneLink).toHaveAttribute("href", "tel:+48500435697");
  });

  it("wyświetla opis bio", () => {
    renderWithI18n(<AuthorPanel />);
    expect(screen.getByText(/Tworzę aplikacje/)).toBeInTheDocument();
  });
});
