import { Comment } from "~/utils";

interface ReplyingToProps {
  replyTo: Comment;
  cancelReply: () => void;
}

const ReplyingTo = ({ replyTo, cancelReply }: ReplyingToProps) => {
  return (
    <div className="mb-2 p-3 border-l-4 border-blue-400 rounded-lg bg-blue-50 flex justify-between items-center">
      <div>
        <strong className="text-blue-800">Replying to:</strong>
        <p className="text-sm text-blue-600">{replyTo.text}</p>
      </div>
      <button onClick={cancelReply} className="text-red-500 hover:text-red-700">
        ✕
      </button>
    </div>
  );
};

export default ReplyingTo;
