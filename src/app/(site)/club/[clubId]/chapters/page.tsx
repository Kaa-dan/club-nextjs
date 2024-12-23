import { ItemGrid } from "@/components/globals/item-grid";
const sampleNodes = [
  {
    id: "1",
    name: "Techmuchmore",
    memberCount: 956,
    location: "Indore, India",
    avatar: "/placeholder.svg?height=128&width=256",
  },
  {
    id: "2",
    name: "UI UX Design",
    memberCount: 15,
    location: "Surat, India",
    avatar: "/placeholder.svg?height=128&width=256",
  },
  {
    id: "3",
    name: "AI Next Gen",
    memberCount: 203,
    location: "Mumbai, India",
    avatar: "/placeholder.svg?height=128&width=256",
  },
  {
    id: "4",
    name: "Figma",
    memberCount: 156,
    location: "Jaipur, India",
    avatar: "/placeholder.svg?height=128&width=256",
  },
  {
    id: "5",
    name: "Time travellers",
    memberCount: 20,
    location: "Delhi, India",
    avatar: "/placeholder.svg?height=128&width=256",
  },
];

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
        <ItemGrid items={sampleClubs} />
      </div>
    </main>
  );
}
