import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import VoiceTutor from "./VoiceTutor";

const mocks = vi.hoisted(() => ({
  recognize: vi.fn(),
  stop: vi.fn(),
  speak: vi.fn(() => Promise.resolve()),
  cancel: vi.fn(),
  detectLanguage: vi.fn(() => Promise.resolve({ language_code: "en" })),
  sendChatMessage: vi.fn(() => Promise.resolve({ reply: "Gravity pulls objects toward Earth." })),
}));

vi.mock("../services/voice", () => ({
  BrowserSpeechRecognizer: vi.fn(() => ({ isSupported: true, recognize: mocks.recognize, stop: mocks.stop })),
  BrowserSpeechSynthesizer: vi.fn(() => ({ speak: mocks.speak, cancel: mocks.cancel })),
  getSpeechLocale: (language) => `${language}-IN`,
}));

vi.mock("../services/api", () => ({
  default: { detectLanguage: mocks.detectLanguage, sendChatMessage: mocks.sendChatMessage },
}));

describe("VoiceTutor", () => {
  beforeEach(() => {
    mocks.recognize.mockReset();
    mocks.recognize.mockResolvedValue("What is gravity?");
    mocks.speak.mockClear();
    mocks.cancel.mockClear();
    mocks.sendChatMessage.mockClear();
    mocks.detectLanguage.mockClear();
  });

  it("sends the transcript to the existing tutor and speaks the response", async () => {
    render(<VoiceTutor />);
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));

    await waitFor(() => expect(screen.getByText("Gravity pulls objects toward Earth.")).toBeInTheDocument());
    expect(mocks.speak).toHaveBeenCalledWith("Gravity pulls objects toward Earth.", "en-IN");
    expect(mocks.sendChatMessage).toHaveBeenCalledWith(expect.objectContaining({
      message: "What is gravity?",
      session_id: expect.stringMatching(/^voice-/),
    }));
    expect(screen.getByRole("button", { name: "Replay response" })).toBeInTheDocument();
  });

  it("clears the transcript and response", async () => {
    render(<VoiceTutor />);
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
    await screen.findByText("Gravity pulls objects toward Earth.");
    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));

    expect(screen.queryByText("What is gravity?")).not.toBeInTheDocument();
    expect(screen.queryByText("Gravity pulls objects toward Earth.")).not.toBeInTheDocument();
  });

  it("shows an API failure and allows retry", async () => {
    mocks.sendChatMessage
      .mockRejectedValueOnce(new Error("Backend unavailable"))
      .mockResolvedValueOnce({ reply: "Gravity pulls objects toward Earth." });
    render(<VoiceTutor />);
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Backend unavailable");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Gravity pulls objects toward Earth.")).toBeInTheDocument();
  });

  it("keeps the response visible when speech playback fails", async () => {
    mocks.speak.mockRejectedValueOnce(new Error("Audio playback failed"));
    render(<VoiceTutor />);
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));

    expect(await screen.findByText("Gravity pulls objects toward Earth.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Audio playback failed");
    expect(screen.getByRole("button", { name: "Replay response" })).toBeInTheDocument();
  });
});