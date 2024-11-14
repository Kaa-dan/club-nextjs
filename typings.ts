type TPlugins = "rules" | "issues";
type TSections = "node" | "club";

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
};
