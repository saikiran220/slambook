import { useState, useMemo } from "react";
import { useEntries } from "@/hooks/useEntries";
import Navbar from "@/components/Navbar";
import EntryCard from "@/components/EntryCard";
import { Search, ArrowUpDown, Star, Filter, Download, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ApiService } from "@/lib/api-service";
import { downloadJSON, readJSONFile } from "@/lib/utils/export";
import { SlamBookEntry } from "@/types/slambook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EntriesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "new" | "old" | "favorites">("new");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { data: entries = [], isLoading } = useEntries();

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach((entry) => {
      entry.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [entries]);

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = entries.filter((entry) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        entry.name.toLowerCase().includes(searchLower) ||
        entry.nickname.toLowerCase().includes(searchLower) ||
        entry.about.toLowerCase().includes(searchLower) ||
        entry.message.toLowerCase().includes(searchLower) ||
        entry.likes?.toLowerCase().includes(searchLower) ||
        entry.dislikes?.toLowerCase().includes(searchLower) ||
        entry.favoriteMovie?.toLowerCase().includes(searchLower) ||
        entry.favoriteFood?.toLowerCase().includes(searchLower) ||
        entry.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

      // Tag filter
      const matchesTag = filterTag === "all" || entry.tags?.includes(filterTag);

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || entry.isFavorite;

      return matchesSearch && matchesTag && matchesFavorites;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "desc") {
        return b.name.localeCompare(a.name);
      } else if (sortOrder === "favorites") {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === "new") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

    return filtered;
  }, [entries, searchTerm, sortOrder, filterTag, showFavoritesOnly]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const jsonData = await ApiService.exportEntries();
      downloadJSON(jsonData, `slambook-entries-${new Date().toISOString().split("T")[0]}.json`);
      toast.success("Entries exported successfully! 📥");
    } catch (error) {
      toast.error("Failed to export entries");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const jsonString = await readJSONFile(file);
      const importedEntries: SlamBookEntry[] = JSON.parse(jsonString);
      const result = await ApiService.importEntries(importedEntries);
      
      if (result.errors.length > 0) {
        toast.warning(`Imported ${result.success} entries with ${result.errors.length} errors`);
      } else {
        toast.success(`Successfully imported ${result.success} entries! 📤`);
      }
      
      // Reset file input
      e.target.value = "";
      // Refresh entries list
      window.location.reload();
    } catch (error) {
      toast.error("Failed to import entries. Please check the file format.");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading entries...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto fade-in">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-secondary bg-clip-text text-transparent">
              All Entries
            </h1>
            <p className="text-muted-foreground text-lg">
              {filteredAndSortedEntries.length} of {entries.length} {entries.length === 1 ? "entry" : "entries"} found
            </p>
          </div>

          {/* Search, Sort, and Actions */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, nickname, about, message, tags, or any field..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3"
              />
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Sort */}
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Newest</SelectItem>
                  <SelectItem value="old">Oldest</SelectItem>
                  <SelectItem value="asc">A → Z</SelectItem>
                  <SelectItem value="desc">Z → A</SelectItem>
                  <SelectItem value="favorites">Favorites ⭐</SelectItem>
                </SelectContent>
              </Select>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Favorites Filter */}
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="flex items-center gap-2"
              >
                <Star className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                Favorites
              </Button>

              {/* Export/Import */}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={handleExport} disabled={isExporting || entries.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <label>
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Entries Grid */}
          {filteredAndSortedEntries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">No entries found</h2>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filterTag !== "all" || showFavoritesOnly
                  ? "Try adjusting your filters"
                  : "Create your first slam book entry to get started!"}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EntriesList;
