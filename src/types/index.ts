import { title } from "process";

export type TNodeData = {
  _id: string;
  name: string;
  about: string;
  location: string;
  description: string;
  createdBy: string;
  members: { user: any; role: "admin" | "moderator" | "member" }[];
  coverImage: {
    fileName: string;
    url: string;
  };
  profileImage: {
    fileName: string;
    url: string;
  };
  createdAt: string;
};

export type TUser = {
  _id: string;
  userName: string;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  profileImage: string;
  coverImage: string;
  interests: string[];
  isBlocked: boolean;
  emailVerified: boolean;
  registered: boolean;
  signupThrough: "google" | "apple" | "facebook" | "gmail";
  isOnBoarded: boolean;
  onBoardingStage: "details" | "image" | "interest" | "node" | "completed";
};

export type TNodeJoinRequest = {
  node: string | TNodeData;
  user: TUser;
  _id: string;
};

export type TClub = {
  _id: string;
  name: string;
  about: string;
  description: string;
  profileImage: {
    filename: string;
    url: string;
  };
  coverImage: {
    filename: string;
    url: string;
  };
  isPublic: boolean;
  status: string;
  members?: any[];
};

export interface Request {
  _id: string;
  club: TClub;
  user: TUser;
  role: "member" | "admin" | "otherRole";
  status: "REQUESTED" | "APPROVED" | "REJECTED";
}

export interface TMembers {
  _id: string;
  club: TClub;
  user: TUser;
  role: "member" | "admin" | "moderator" | "owner";
  status: "REQUESTED" | "APPROVED" | "REJECTED";
  createdAt: Date;
  designation: string;
  position: string;
}

type IssueType =
  | "Bug"
  | "Seeking Strategies"
  | "Feature Request"
  | "Documentation"
  | "Task"
  | "Other";

export type TIssue = {
  _id: string;
  title: string;
  issueType: IssueType;
  whereWho: string;
  deadline?: string; // Optional, in "DD-MM-YYYY" format
  deadlineReason?: string;
  significance: string;
  whoShouldAddress: string;
  description: string;
  files: File[]; // Array of File objects for uploaded files
  isPublic: boolean;
  showName: boolean;
  status: "ACTIVE" | "RESOLVED" | "INACTIVE";
  createdAt: string;
  postedBy: {
    name: string;
    avatar: string;
  };
  relevanceScore: number;
};

export type TChapter = {
  _id: string;
  name: string;
  club: string;
  node: string;
  status: string;
  about: string;
  publishedBy: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  profileImage: {
    url: string;
  };
  coverImage: {
    url: string;
  };
  members?: any[];
  proposedBy: TUser;
};
