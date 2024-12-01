import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import CommentList from "../app/components/CommentList";
import { Comment } from "~/interfaces";

describe("CommentList", () => {
  const mockComments: Comment[] = [
    { id: 1, parentId: null, timestamp: 1, text: "Parent comment" },
    { id: 2, parentId: 1, timestamp: 2, text: "Child comment" },
  ];
  const mockHandleReply = vi.fn();
  const mockHandleDelete = vi.fn();

  const setup = () => {
    render(
      <CommentList
        comments={mockComments}
        handleReply={mockHandleReply}
        handleDelete={mockHandleDelete}
      />
    );
  };

  it("renders parent and child comments", () => {
    setup();

    expect(screen.getByText("Parent comment")).toBeInTheDocument();
    expect(screen.getByText("Child comment")).toBeInTheDocument();
  });

  it("calls handleReply when the Reply button is clicked", () => {
    setup();

    fireEvent.click(screen.getAllByText("↩ Reply")[0]);
    expect(mockHandleReply).toHaveBeenCalledWith(mockComments[0]);
  });

  it("calls handleDelete when the Delete button is clicked", () => {
    setup();

    fireEvent.click(screen.getAllByText("✕ Delete")[0]);
    expect(mockHandleDelete).toHaveBeenCalledWith(mockComments[0].id);
  });
});
