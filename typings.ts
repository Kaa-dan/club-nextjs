type TPlugins = "rules" | "issues";
type TSections = "node" | "club";

interface TCommentUser {
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  coverImage: string;
  interests: string[];
}

interface TCommentReply extends TCommentUser {
  _id: string;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

interface TCommentType extends TCommentUser {
  _id: string;
  content: string;
  attachment?: {
    url: string;
    filename: string;
    mimetype: string;
  };
  createdAt: string;
  replies: TCommentReply[];
  likes: number;
  dislikes: number;
}