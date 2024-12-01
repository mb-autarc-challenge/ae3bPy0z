import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useBroadcastChannel } from "~/hooks/useBroadcastChannel";
import { usePersistence } from "~/hooks/usePersistence";
import { Comment } from "~/utils";

export default function Index() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { saveComment, loadComments } = usePersistence();

  const updateChannel = useBroadcastChannel(
    "autarc",
    (message) => handleIncommingMessage(message),
    () => {
      // Ideally we would handle errors here, not implementing for now
    }
  );

  useEffect(() => {
    const fetchComments = async () => {
      const storedComments = await loadComments();
      setComments(storedComments);
    };

    fetchComments();
  }, [loadComments]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddComment = async () => {
    if (commentInput.trim() === "") return;

    const newComment: Comment = {
      id: Date.now(),
      parentId: replyTo?.id ?? null,
      timestamp: Date.now(),
      text: commentInput,
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    await saveComment(newComment);
    console.log("Posting message:", updatedComments);

    updateChannel(JSON.stringify(newComment));

    setCommentInput("");
    setReplyTo(null);

    // Scroll to bottom only if not replying to a comment
    if (replyTo === null) {
      scrollToBottom();
    }
  };

  const handleReply = (comment: Comment) => {
    if (comment) {
      setReplyTo(comment);
      setCommentInput("");
      textareaRef.current?.focus();
    }
  };

  const handleIncommingMessage = (message: MessageEvent) => {
    const newComment: Comment = JSON.parse(message.data);

    setComments((prevComments) => {
      const updatedComments = [...prevComments, newComment];
      return updatedComments;
    });

    // Scroll to bottom only if not replying to a comment.
    // Bad UX if the user is reading a comment and a new one is added but good enough for this example.
    if (newComment.parentId === null) {
      scrollToBottom();
    }
  };

  const renderComments = (parentId: number | null) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((comment) => (
        <div
          key={comment.id}
          className="flex flex-col gap-2 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md"
        >
          <div className="text-gray-800">{comment.text}</div>
          <button
            className="self-end text-blue-500 hover:underline text-sm"
            onClick={() => handleReply(comment)}
          >
            ↩ Reply
          </button>
          <div className="pl-4">{renderComments(comment.id)}</div>
        </div>
      ));
  };

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentInput(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelReply();
    }
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        <div className="flex flex-col gap-4">{renderComments(null)}</div>
        <div ref={commentsEndRef} />
      </div>
      <div className="flex flex-col">
        {replyTo && (
          <div className="mb-2 p-3 border-l-4 border-blue-400 rounded-lg bg-blue-50 flex justify-between items-center">
            <div>
              <strong className="text-blue-800">Replying to:</strong>
              <p className="text-sm text-blue-600">{replyTo.text}</p>
            </div>
            <button
              onClick={cancelReply}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex items-center bg-gray-50 p-4 border-t border-gray-200 shadow-inner">
          <textarea
            ref={textareaRef}
            value={commentInput}
            onChange={onChange}
            onKeyDown={onKeyDown}
            rows={3}
            placeholder="Write your comment..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            {replyTo ? "Reply" : "Add Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}
