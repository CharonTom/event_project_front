import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HomeBanner from "../src/components/HomeBanner";

describe("HomeBanner", () => {
  beforeEach(() => {
    render(<HomeBanner />, { wrapper: MemoryRouter });
  });

  it("affiche les trois phrases clés", () => {
    expect(
      screen.getByText("Organisez-vous des événements ?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Faisons bouger le monde ensemble")
    ).toBeInTheDocument();
    expect(screen.getByText("Créer • Promouvoir • Vendre")).toBeInTheDocument();
  });

  it("rend l’image avec le bon src et alt", () => {
    const img = screen.getByAltText("a singing girl");
    expect(img.src).toContain("singer-girl.png");
    expect(img).toHaveAttribute("alt", "a singing girl");
  });

  it("a un bouton “Créer un événement” avec les bonnes classes", () => {
    const btn = screen.getByRole("button", { name: /créer un événement/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("btn-primary");
  });
});
