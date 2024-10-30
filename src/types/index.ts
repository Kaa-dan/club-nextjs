export type NodeData = {
  _id: string;
  name: string;
  about: string;
  location: string;
  descripion: string;
  members: { user: any; role: "admin" | "moderator" | "member" }[];
  coverImage: string;
  profileImage: string;
};
