import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import CommentForm from "../app/components/CommentForm";

describe("CommentForm", () => {
  const mockHandleSubmit = vi.fn();
  const mockOnKeyDown = vi.fn();
  const mockOnChange = vi.fn();
  const mockFormRef = vi.fn();

  const setup = () => {
    render(
      <CommentForm
        commentInput="Test comment"
        handleSubmit={mockHandleSubmit}
        onKeyDown={mockOnKeyDown}
        onChange={mockOnChange}
        formRef={mockFormRef}
      />
    );
  };

  it("renders the textarea and button", () => {
    setup();

    expect(
      screen.getByPlaceholderText("Write your comment...")
    ).toBeInTheDocument();
    expect(screen.getByText("Add Comment")).toBeInTheDocument();
  });

  it("calls onChange when the textarea value changes", () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText("Write your comment..."), {
      target: { value: "New comment" },
    });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("calls onKeyDown when a key is pressed in the textarea", () => {
    setup();

    fireEvent.keyDown(screen.getByPlaceholderText("Write your comment..."), {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    expect(mockOnKeyDown).toHaveBeenCalled();
  });

  it("calls handleSubmit when the button is clicked", () => {
    setup();

    fireEvent.click(screen.getByText("Add Comment"));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
