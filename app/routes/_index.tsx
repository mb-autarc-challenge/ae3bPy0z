import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useBroadcastChannel } from "~/hooks/useBroadcastChannel";
import { usePersistence } from "~/hooks/usePersistence";
import { Comment } from "~/utils";

export default function Index() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyToText, setReplyToText] = useState<string | null>(null);
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
      parentId: replyTo,
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
    setReplyToText(null);

    // Scroll to bottom only if not replying to a comment
    if (replyTo === null) {
      scrollToBottom();
    }
  };

  const handleReply = (id: number) => {
    const comment = comments.find((comment) => comment.id === id);
    if (comment) {
      setReplyTo(id);
      setReplyToText(comment.text);
      setCommentInput("");
      textareaRef.current?.focus();
    }
  };

  const renderComments = (parentId: number | null) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((comment) => (
        <div
          key={comment.id}
          className="flex flex-col gap-2 p-4 border rounded shadow-sm"
        >
          <div>{comment.text}</div>
          <button
            onClick={() => handleReply(comment.id)}
            className="self-end text-blue-500"
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
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">{renderComments(null)}</div>
        <div ref={commentsEndRef} />
      </div>
      <div className="flex flex-col p-4 border-t">
        {replyToText && (
          <div className="mb-2 p-2 border rounded bg-gray-100">
            <strong>Replying to:</strong>
            <p className="text-sm text-gray-700">{replyToText}</p>
          </div>
        )}
        <div className="flex items-center">
          <textarea
            ref={textareaRef}
            value={commentInput}
            onChange={onChange}
            onKeyDown={onKeyDown}
            rows={4}
            className="flex-1 mr-2 p-2 border rounded"
          />
          <button
            onClick={handleAddComment}
            className="p-2 bg-blue-500 text-white rounded"
          >
            {replyTo ? "Reply" : "Add Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}

function handleIncommingMessage(message: MessageEvent<any>): void {
  throw new Error("Function not implemented.");
}
