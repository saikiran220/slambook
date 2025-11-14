import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entrySchema, EntryFormData } from "@/lib/validations";
import { useEntry, useSaveEntry } from "@/hooks/useEntries";
import { SlamBookEntry } from "@/types/slambook";
import Navbar from "@/components/Navbar";
import { Save, X, Tag, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CreateEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { data: existingEntry, isLoading } = useEntry(id);
  const saveEntryMutation = useSaveEntry();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      name: "",
      nickname: "",
      birthday: "",
      contactNumber: "",
      likes: "",
      dislikes: "",
      favoriteMovie: "",
      favoriteFood: "",
      about: "",
      message: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (isEditMode && existingEntry) {
      reset({
        name: existingEntry.name,
        nickname: existingEntry.nickname,
        birthday: existingEntry.birthday,
        contactNumber: existingEntry.contactNumber,
        likes: existingEntry.likes || "",
        dislikes: existingEntry.dislikes || "",
        favoriteMovie: existingEntry.favoriteMovie || "",
        favoriteFood: existingEntry.favoriteFood || "",
        about: existingEntry.about,
        message: existingEntry.message,
        tags: existingEntry.tags || [],
      });
      setTags(existingEntry.tags || []);
    }
  }, [existingEntry, isEditMode, reset]);

  const onSubmit = (data: EntryFormData) => {
    const entry: SlamBookEntry = {
      id: isEditMode ? id! : "",
      ...data,
      tags: tags.length > 0 ? tags : undefined,
      createdAt: isEditMode ? existingEntry?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: existingEntry?.updatedAt,
      isFavorite: existingEntry?.isFavorite || false,
      contactNumber: data.contactNumber, // Ensure correct field name
    };

    saveEntryMutation.mutate(entry, {
      onSuccess: () => {
        navigate("/entries");
      },
    });
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-card rounded-3xl shadow-xl p-6 md:p-10 fade-in border border-border">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
              {isEditMode ? "Edit Your Entry" : "Create New Entry"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? "Update your slam book information" : "Fill in your details to create a slam book entry"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Nickname */}
              <div>
                <Label htmlFor="nickname">
                  Nickname <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nickname"
                  {...register("nickname")}
                  placeholder="Your nickname"
                  className={errors.nickname ? "border-destructive" : ""}
                />
                {errors.nickname && <p className="text-destructive text-sm mt-1">{errors.nickname.message}</p>}
              </div>

              {/* Birthday */}
              <div>
                <Label htmlFor="birthday">
                  Birthday <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  {...register("birthday")}
                  className={errors.birthday ? "border-destructive" : ""}
                />
                {errors.birthday && <p className="text-destructive text-sm mt-1">{errors.birthday.message}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <Label htmlFor="contactNumber">
                  Contact Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  {...register("contactNumber")}
                  placeholder="Your phone number"
                  className={errors.contactNumber ? "border-destructive" : ""}
                />
                {errors.contactNumber && <p className="text-destructive text-sm mt-1">{errors.contactNumber.message}</p>}
              </div>

              {/* Likes */}
              <div>
                <Label htmlFor="likes">Likes</Label>
                <Input id="likes" {...register("likes")} placeholder="Things you like" />
              </div>

              {/* Dislikes */}
              <div>
                <Label htmlFor="dislikes">Dislikes</Label>
                <Input id="dislikes" {...register("dislikes")} placeholder="Things you dislike" />
              </div>

              {/* Favorite Movie */}
              <div>
                <Label htmlFor="favoriteMovie">Favorite Movie</Label>
                <Input id="favoriteMovie" {...register("favoriteMovie")} placeholder="Your favorite movie" />
              </div>

              {/* Favorite Food */}
              <div>
                <Label htmlFor="favoriteFood">Favorite Food</Label>
                <Input id="favoriteFood" {...register("favoriteFood")} placeholder="Your favorite food" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" onClick={addTag} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <div>
              <Label htmlFor="about">
                About Yourself <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="about"
                {...register("about")}
                rows={4}
                className={errors.about ? "border-destructive" : ""}
                placeholder="Tell us about yourself..."
              />
              {errors.about && <p className="text-destructive text-sm mt-1">{errors.about.message}</p>}
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">
                A Memorable Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                rows={4}
                className={errors.message ? "border-destructive" : ""}
                placeholder="Leave a memorable message..."
              />
              {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary text-white font-semibold hover:shadow-lg transition-all duration-300"
                disabled={saveEntryMutation.isPending}
              >
                <Save className="w-5 h-5 mr-2" />
                {saveEntryMutation.isPending ? "Saving..." : isEditMode ? "Update Entry" : "Create Entry"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/entries")}
                disabled={saveEntryMutation.isPending}
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEntry;
