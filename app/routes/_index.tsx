import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useBroadcastChannel } from "~/hooks/useBroadcastChannel";
import { usePersistence } from "~/hooks/usePersistence";
import { Comment } from "~/utils";
import CommentList from "~/components/CommentList";
import CommentForm from "~/components/CommentForm";
import ReplyingTo from "~/components/ReplyingTo";

export default function Index() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { saveComment, loadComments, deleteComment } = usePersistence();

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

  const handleDeleteComment = async (id: number) => {
    const updatedComments = comments.filter((comment) => comment.id !== id);
    setComments(updatedComments);
    await deleteComment(id);
    console.log("Deleting message:", id);

    updateChannel(JSON.stringify({ id, action: "delete" }));
  };

  const handleReply = (comment: Comment) => {
    if (comment) {
      setReplyTo(comment);
      setCommentInput("");
      textareaRef.current?.focus();
    }
  };

  const handleIncommingMessage = (message: MessageEvent) => {
    const data = JSON.parse(message.data);

    if (data.action === "delete") {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== data.id)
      );
    } else {
      const newComment: Comment = data;
      setComments((prevComments) => [...prevComments, newComment]);
    }

    // Scroll to bottom only if not replying to a comment.
    // Bad UX if the user is reading a comment and a new one is added but good enough for this example.
    if (data.parentId === null) {
      scrollToBottom();
    }
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
        <CommentList
          comments={comments}
          handleReply={handleReply}
          handleDelete={handleDeleteComment}
        />
        <div ref={commentsEndRef} />
      </div>
      <div className="flex flex-col">
        {replyTo && <ReplyingTo replyTo={replyTo} cancelReply={cancelReply} />}
        <CommentForm
          formRef={textareaRef}
          commentInput={commentInput}
          handleSubmit={handleAddComment}
          onKeyDown={onKeyDown}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
