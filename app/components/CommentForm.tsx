import { ChangeEvent, KeyboardEvent, Ref } from "react";

interface CommentFormProps {
  commentInput: string;
  handleSubmit: () => void;
  formRef: Ref<HTMLTextAreaElement>;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function CommentForm({
  commentInput,
  handleSubmit,
  onKeyDown,
  onChange,
  formRef,
}: CommentFormProps) {
  return (
    <div className="flex items-center bg-gray-50 p-4 border-t border-gray-200 shadow-inner">
      <textarea
        ref={formRef}
        value={commentInput}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={3}
        placeholder="Write your comment..."
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
      >
        Add Comment
      </button>
    </div>
  );
}
