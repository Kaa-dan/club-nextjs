export type TNodeData = {
  _id: string;
  name: string;
  about: string;
  location: string;
  descripion: string;
  members: { user: any; role: "admin" | "moderator" | "member" }[];
  coverImage: string;
  profileImage: string;
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
};
