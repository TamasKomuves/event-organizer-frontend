export interface IComment {
  id?: number;
  postId: number;
  text: string;
  commenterEmail?: string;
  commentDate?: string;
}
