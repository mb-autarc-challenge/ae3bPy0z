import CommentItem from "./CommentItem";
import { Comment } from "~/interfaces";

interface CommentListProps {
  comments: Comment[];
  handleReply: (comment: Comment) => void;
  handleDelete: (id: number) => void;
}

export default function CommentList({
  comments,
  handleReply,
  handleDelete,
}: CommentListProps) {
  const renderComments = (parentId: number | null) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={handleReply}
          onDelete={handleDelete}
          renderReplies={() => renderComments(comment.id)}
        />
      ));
  };

  return <div>{renderComments(null)}</div>;
}
