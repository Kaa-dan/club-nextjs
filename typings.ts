type TPlugins = "rules" | "issues" | "debate";
type TSections = "node" | "club";
type TFileType = "image" | "video" | "document" | "pdf" | "unknown";
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
  like: string[];
  dislike: string[];
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
  like: any[];
  dislike: any[];
}

type RuleFile = {
  url: string;
  originalname: string;
  mimetype: string;
  size: number;
  _id: string;
};

type TUser = {
  _id: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  interests: string[];
  isBlocked: boolean;
  emailVerified: boolean;
  registered: boolean;
  signupThrough: string;
  isOnBoarded: boolean;
  onBoardingStage: string;
  createdAt: string;
  updatedAt?: string;
  dateOfBirth: string;
  firstName: string;
  gender: string;
  lastName: string;
  coverImage: string;
  profileImage: string;
};
type TRule = {
  _id: string;
  title: string;
  description: string;
  domain: string;
  category: string;
  significance: string;
  tags: string[];
  isPublic: boolean;
  files: Array<RuleFile>;
  club: string | null;
  node: string;
  createdBy: TUser;
  version: number;
  publishedStatus: string;
  publishedDate: string;
  publishedBy: string;
  isActive: boolean;
  relevant: Array<any>;
  views: any[]; // Define more specifically if you have a structure for views
  createdAt: string;
  updatedAt: string;
  __v: number;
  irrelevant: Array<any>;
  adobtedClubs: [];
};
