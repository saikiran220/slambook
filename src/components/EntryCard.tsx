import { Link } from "react-router-dom";
import { SlamBookEntry } from "@/types/slambook";
import { Eye, Star, Tag } from "lucide-react";
import { formatDate, getRelativeTime } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { useToggleFavorite } from "@/hooks/useEntries";

interface EntryCardProps {
  entry: SlamBookEntry;
}

const EntryCard = ({ entry }: EntryCardProps) => {
  const toggleFavorite = useToggleFavorite();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const gradients = [
    "bg-gradient-primary",
    "bg-gradient-secondary",
    "bg-gradient-accent",
  ];

  const gradientIndex = parseInt(entry.id.split("_")[1] || "0", 10) % gradients.length;
  const randomGradient = gradients[gradientIndex];

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite.mutate(entry.id);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group card-hover border border-border relative">
      {entry.isFavorite && (
        <div className="absolute top-2 right-2 z-10">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full ${randomGradient} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
            {getInitials(entry.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
              {entry.name}
            </h3>
            <p className="text-muted-foreground text-sm truncate">@{entry.nickname}</p>
            <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(entry.createdAt)}</p>
          </div>
        </div>

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {entry.tags.length > 3 && (
              <span className="text-xs text-muted-foreground px-2 py-0.5">
                +{entry.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {entry.about}
        </p>

        <div className="flex gap-2">
          <Link
            to={`/entry/${entry.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-primary text-white font-medium hover:shadow-lg transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            View More
          </Link>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleFavoriteClick}
            className={entry.isFavorite ? "bg-yellow-50 border-yellow-300" : ""}
            title={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={`w-4 h-4 ${entry.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntryCard;
