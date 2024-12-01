import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import CommentItem from "../app/components/CommentItem";
import { Comment } from "~/utils";

describe("CommentItem", () => {
  const mockComment: Comment = {
    id: 1,
    parentId: null,
    timestamp: Date.now(),
    text: "Test comment",
  };
  const mockOnReply = vi.fn();
  const mockOnDelete = vi.fn();
  const mockRenderReplies = vi.fn(() => <div>Replies</div>);

  const setup = () => {
    render(
      <CommentItem
        comment={mockComment}
        onReply={mockOnReply}
        onDelete={mockOnDelete}
        renderReplies={mockRenderReplies}
      />
    );
  };

  it("renders the comment text", () => {
    setup();

    expect(screen.getByText("Test comment")).toBeInTheDocument();
  });

  it("renders the CommentActions component", () => {
    setup();

    expect(screen.getByText("↩ Reply")).toBeInTheDocument();
    expect(screen.getByText("✕ Delete")).toBeInTheDocument();
  });

  it("renders the replies", () => {
    setup();

    expect(screen.getByText("Replies")).toBeInTheDocument();
  });

  it("calls onReply when the Reply button is clicked", () => {
    setup();

    fireEvent.click(screen.getByText("↩ Reply"));
    expect(mockOnReply).toHaveBeenCalledWith(mockComment);
  });

  it("calls onDelete when the Delete button is clicked", () => {
    setup();

    fireEvent.click(screen.getByText("✕ Delete"));
    expect(mockOnDelete).toHaveBeenCalledWith(mockComment.id);
  });
});
