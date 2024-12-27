import { ChaptersList } from "@/components/pages/chapters/chapters-list";

const sampleClubs = [
  {
    id: "1",
    name: "Photography Club",
    memberCount: 78,
    location: "Mumbai, India",
    avatar: "/placeholder.svg?height=128&width=256",
  },
  {
    id: "2",
    name: "Book Lovers",
    memberCount: 120,
    location: "Delhi, India",
    avatar: "/placeholder.svg?height=128&width=256",
  },
  {
    id: "3",
    name: "Fitness Enthusiasts",
    memberCount: 95,
    location: "Bangalore, India",
    avatar: "/placeholder.svg?height=128&width=256",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto space-y-12 px-4">
        <ChaptersList items={sampleClubs} />
      </div>
    </main>
  );
}
