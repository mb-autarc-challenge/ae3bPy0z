export interface Comment {
  id: number;
  parentId: number | null;
  timestamp: number;
  text: string;
}
