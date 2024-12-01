import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import CommentActions from "../app/components/CommentActions";
import { Comment } from "~/utils";

describe("CommentActions", () => {
  const mockComment: Comment = {
    id: 1,
    parentId: null,
    timestamp: Date.now(),
    text: "Test comment",
  };
  const mockOnReply = vi.fn();
  const mockOnDelete = vi.fn();

  it("renders Reply and Delete buttons", () => {
    render(
      <CommentActions
        comment={mockComment}
        onReply={mockOnReply}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("↩ Reply")).toBeInTheDocument();
    expect(screen.getByText("✕ Delete")).toBeInTheDocument();
  });

  it("calls onReply when Reply button is clicked", () => {
    render(
      <CommentActions
        comment={mockComment}
        onReply={mockOnReply}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText("↩ Reply"));
    expect(mockOnReply).toHaveBeenCalledWith(mockComment);
  });

  it("calls onDelete when Delete button is clicked", () => {
    render(
      <CommentActions
        comment={mockComment}
        onReply={mockOnReply}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText("✕ Delete"));
    expect(mockOnDelete).toHaveBeenCalledWith(mockComment.id);
  });
});
