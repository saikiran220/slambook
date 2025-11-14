import { useParams, useNavigate, Link } from "react-router-dom";
import { useEntry, useDeleteEntry, useToggleFavorite } from "@/hooks/useEntries";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Phone,
  Heart,
  HeartOff,
  Film,
  Utensils,
  MessageSquare,
  Star,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatBirthdayWithAge } from "@/lib/utils/date";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";

const EntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: entry, isLoading, error } = useEntry(id);
  const deleteEntryMutation = useDeleteEntry();
  const toggleFavoriteMutation = useToggleFavorite();

  const handleDelete = () => {
    if (!id) return;
    deleteEntryMutation.mutate(id, {
      onSuccess: () => {
        navigate("/entries");
      },
    });
  };

  const handleToggleFavorite = () => {
    if (!id) return;
    toggleFavoriteMutation.mutate(id);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div>Loading entry...</div>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Entry not found</h1>
          <Link to="/entries" className="text-primary hover:underline">
            Go back to entries
          </Link>
        </div>
      </div>
    );
  }

  const InfoCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <Card className="p-4 hover:bg-muted/50 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      </div>
      <p className="text-foreground font-medium">{value || "Not specified"}</p>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="fade-in">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/entries")}
            className="mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to entries
          </Button>

          {/* Main Card */}
          <div className="bg-card rounded-3xl shadow-xl overflow-hidden border border-border">
            {/* Header with gradient */}
            <div className="gradient-bg p-8 text-white relative">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {getInitials(entry.name)}
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h1 className="text-4xl font-bold">{entry.name}</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleFavorite}
                      className="text-white hover:bg-white/20 h-auto w-auto p-2"
                      title={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star
                        className={`w-6 h-6 ${entry.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`}
                      />
                    </Button>
                  </div>
                  <p className="text-white/90 text-lg">@{entry.nickname}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Basic Info Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard
                  icon={Calendar}
                  label="Birthday"
                  value={formatBirthdayWithAge(entry.birthday)}
                />
                <InfoCard icon={Phone} label="Contact" value={entry.contactNumber} />
                <InfoCard icon={Film} label="Favorite Movie" value={entry.favoriteMovie || ""} />
                <InfoCard icon={Utensils} label="Favorite Food" value={entry.favoriteFood || ""} />
              </div>

              {/* Likes & Dislikes */}
              {(entry.likes || entry.dislikes) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {entry.likes && (
                    <Card className="bg-success/10 border-success/20 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="w-5 h-5 text-success" />
                        <h3 className="font-semibold text-success">Likes</h3>
                      </div>
                      <p className="text-foreground">{entry.likes}</p>
                    </Card>
                  )}

                  {entry.dislikes && (
                    <Card className="bg-destructive/10 border-destructive/20 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <HeartOff className="w-5 h-5 text-destructive" />
                        <h3 className="font-semibold text-destructive">Dislikes</h3>
                      </div>
                      <p className="text-foreground">{entry.dislikes}</p>
                    </Card>
                  )}
                </div>
              )}

              {/* About */}
              <Card className="bg-accent/10 border-accent/20 p-6">
                <h3 className="font-semibold text-accent mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  About
                </h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{entry.about}</p>
              </Card>

              {/* Message */}
              <Card className="bg-primary/10 border-primary/20 p-6">
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Memorable Message
                </h3>
                <p className="text-foreground leading-relaxed italic whitespace-pre-wrap">"{entry.message}"</p>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Link to={`/edit/${entry.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-secondary text-white font-semibold hover:shadow-lg transition-all duration-300">
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Entry
                  </Button>
                </Link>

                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this entry? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EntryDetail;
