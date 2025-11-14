import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/lib/api-service";
import { SlamBookEntry } from "@/types/slambook";
import { toast } from "sonner";

/**
 * Query key factory for entries
 */
export const entryKeys = {
  all: ["entries"] as const,
  lists: () => [...entryKeys.all, "list"] as const,
  list: (filters?: string) => [...entryKeys.lists(), { filters }] as const,
  details: () => [...entryKeys.all, "detail"] as const,
  detail: (id: string) => [...entryKeys.details(), id] as const,
  statistics: () => [...entryKeys.all, "statistics"] as const,
};

/**
 * Hook to get all entries
 */
export const useEntries = () => {
  return useQuery({
    queryKey: entryKeys.lists(),
    queryFn: () => ApiService.getEntries(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get a single entry by ID
 */
export const useEntry = (id: string | undefined) => {
  return useQuery({
    queryKey: entryKeys.detail(id!),
    queryFn: () => {
      if (!id) throw new Error("Entry ID is required");
      return ApiService.getEntryById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to get statistics
 */
export const useStatistics = () => {
  return useQuery({
    queryKey: entryKeys.statistics(),
    queryFn: () => ApiService.getStatistics(),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to save an entry (create or update)
 */
export const useSaveEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: SlamBookEntry) => {
      // Check if entry has a valid UUID (from backend) to determine if it's an update
      // UUIDs are typically 36 characters long (with hyphens) and start with non-numeric characters
      const isUpdate = entry.id && entry.id.length > 10 && !entry.id.startsWith("entry_");
      
      if (isUpdate) {
        // Existing entry being updated
        const { id, createdAt, updatedAt, user_id, ...entryData } = entry;
        return { entry: await ApiService.updateEntry(id!, entryData), isUpdate: true };
      } else {
        // New entry being created
        const { id, createdAt, updatedAt, user_id, ...entryData } = entry;
        return { entry: await ApiService.createEntry(entryData), isUpdate: false };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: entryKeys.all });
      toast.success(result.isUpdate ? "Entry updated successfully! 🎉" : "Entry created successfully! 🎉");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || error.message || "Failed to save entry");
    },
  });
};

/**
 * Hook to delete an entry
 */
export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ApiService.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entryKeys.all });
      toast.success("Entry deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || error.message || "Failed to delete entry");
    },
  });
};

/**
 * Hook to toggle favorite status
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ApiService.toggleFavorite(id),
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: entryKeys.all });
      toast.success(entry.isFavorite ? "Added to favorites ⭐" : "Removed from favorites");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || error.message || "Failed to update favorite status");
    },
  });
};

