type TUserRole = "admin" | "member" | "owner" | "moderator";
type TPlugins = "rules" | "issues" | "debate";
type TForum = "node" | "club";
type TFileType = "image" | "video" | "document" | "pdf" | "unknown";
type TJoinStatus = "VISITOR" | "MEMBER" | "REQUESTED";
type TIssuesLabel =
  | "Live Issues"
  | "All Issues"
  | "Global Library"
  | "My Issues"
  | "Proposed Issues";

interface TCommentUser {
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  coverImage: string;
  interests: string[];
  userName: string;
}

interface TCommentReply extends TCommentUser {
  _id: string;
  content: string;
  createdAt: string;
  like: string[];
  dislike: string[];
  userName: string;
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

interface IssueFile {
  url: string;
  originalname: string;
  mimetype: string;
  size: number;
  _id: string;
}

interface IRelevantAndView {
  user: string;
  date: Date;
}

interface IAdoptedItem {
  club?: string;
  node?: string;
  date: Date;
}

type TIssue = {
  _id: string;
  title: string;
  issueType: string;
  deadline?: Date;
  whereOrWho?: string;
  reasonOfDeadline?: string;
  significance?: string;
  whoShouldAddress: Array<any>;
  description: string;
  files: Array<IssueFile>;

  // Boolean flags
  isPublic: boolean;
  isAnonymous: boolean;
  isActive: boolean;
  isDeleted: boolean;

  // Interactions
  views: Array<any>;
  relevant: Array<any>;
  irrelevant: Array<any>;

  // References
  club: string | null;
  node: string;
  createdBy: TUser;
  publishedBy: string;
  adoptedFrom: string | null;

  // Dates
  publishedDate: string;
  updatedDate: string;
  adoptedDate: string;
  createdAt: string;
  updatedAt: string;

  // Adoption related
  adoptedClubs: Array<IAdoptedItem>;
  adoptedNodes: Array<IAdoptedItem>;

  // Version control
  version: number;
  publishedStatus:
    | "draft"
    | "published"
    | "olderversion"
    | "proposed"
    | "archived";
  olderVersions: Array<Record<string, any>>;

  __v: number;
};

type Argument = {
  _id: string;
  content: string;
  participant: {
    side: "support" | "against";
    user: {
      userName: string;
      profileImage: string;
    };
  };
  image: [
    {
      mimetype: string;
      url: string;
    },
  ];
  timestamp: string;
  relevant: number;
  irrelevant: number;
};
