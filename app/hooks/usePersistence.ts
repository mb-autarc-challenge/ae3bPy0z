import { openDB } from "idb";

interface Comment {
  id: number;
  parentId: number | null;
  timestamp: number;
  text: string;
}

const DB_NAME = "commentsDB";
const STORE_NAME = "comments";

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    },
  });
};

export function usePersistence() {
  const saveComment = async (comment: Comment) => {
    const db = await initDB();
    await db.put(STORE_NAME, comment);
  };

  const deleteComment = async (id: number) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
  };

  const loadComments = async () => {
    const db = await initDB();
    // db.clear(STORE_NAME); // Uncomment to clear the comments
    return await db.getAll(STORE_NAME);
  };

  return { saveComment, deleteComment, loadComments };
}
