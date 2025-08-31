import { Badge } from "@/components/ui/badge";

export default function GuildHeader({ name, memberCount }) {
  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 className="text-3xl font-bold">{name}</h1>
      <Badge className="mt-2 md:mt-0">{memberCount} members</Badge>
    </header>
  );
}
