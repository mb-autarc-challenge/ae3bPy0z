import CommentActions from "./CommentActions";
import { Comment } from "~/utils";

interface CommentItemProps {
  comment: Comment;
  onReply: (comment: Comment) => void;
  onDelete: (id: number) => void;
  renderReplies: () => React.ReactNode;
}

const CommentItem = ({
  comment,
  onReply,
  onDelete,
  renderReplies,
}: CommentItemProps) => {
  return (
    <div className="flex flex-col gap-2 p-4 border-b rounded-lg bg-white shadow-sm hover:shadow-md">
      <div className="text-gray-800">{comment.text}</div>
      <CommentActions comment={comment} onReply={onReply} onDelete={onDelete} />
      <div className="pl-4">{renderReplies()}</div>
    </div>
  );
};

export default CommentItem;
