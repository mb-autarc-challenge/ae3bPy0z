import { Comment } from "~/utils";

interface CommentActionsProps {
  comment: Comment;
  onReply: (comment: Comment) => void;
  onDelete: (id: number) => void;
}

const CommentActions = ({
  comment,
  onReply,
  onDelete,
}: CommentActionsProps) => {
  return (
    <div className="flex justify-between">
      <button
        className="text-blue-500 hover:underline text-sm"
        onClick={() => onReply(comment)}
      >
        ↩ Reply
      </button>
      <button
        className="text-red-500 hover:underline text-sm"
        onClick={() => onDelete(comment.id)}
      >
        ✕ Delete
      </button>
    </div>
  );
};

export default CommentActions;
