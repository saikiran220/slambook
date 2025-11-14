import { SlamBookEntry } from "@/types/slambook";

const STORAGE_KEY = "slambook_entries";

/**
 * Entry Service - Handles all CRUD operations for slam book entries
 */
export class EntryService {
  /**
   * Get all entries from localStorage
   */
  static getEntries(): SlamBookEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  }

  /**
   * Save an entry (create or update)
   */
  static saveEntry(entry: SlamBookEntry): void {
    try {
      const entries = this.getEntries();
      const existingIndex = entries.findIndex((e) => e.id === entry.id);

      const now = new Date().toISOString();
      if (existingIndex >= 0) {
        // Update existing entry, preserve createdAt
        entries[existingIndex] = {
          ...entry,
          createdAt: entries[existingIndex].createdAt,
          updatedAt: now,
        };
      } else {
        // Create new entry
        entries.push({
          ...entry,
          createdAt: entry.createdAt || now,
          updatedAt: undefined,
        });
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      throw new Error("Failed to save entry");
    }
  }

  /**
   * Delete an entry by ID
   */
  static deleteEntry(id: string): void {
    try {
      const entries = this.getEntries();
      const filtered = entries.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting from localStorage:", error);
      throw new Error("Failed to delete entry");
    }
  }

  /**
   * Get an entry by ID
   */
  static getEntryById(id: string): SlamBookEntry | undefined {
    const entries = this.getEntries();
    return entries.find((e) => e.id === id);
  }

  /**
   * Toggle favorite status of an entry
   */
  static toggleFavorite(id: string): void {
    try {
      const entries = this.getEntries();
      const entry = entries.find((e) => e.id === id);
      if (entry) {
        entry.isFavorite = !entry.isFavorite;
        entry.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw new Error("Failed to toggle favorite");
    }
  }

  /**
   * Export all entries as JSON
   */
  static exportEntries(): string {
    try {
      const entries = this.getEntries();
      return JSON.stringify(entries, null, 2);
    } catch (error) {
      console.error("Error exporting entries:", error);
      throw new Error("Failed to export entries");
    }
  }

  /**
   * Import entries from JSON
   */
  static importEntries(jsonString: string): { success: number; errors: string[] } {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) {
        throw new Error("Invalid format: expected an array");
      }

      const existing = this.getEntries();
      const existingIds = new Set(existing.map((e) => e.id));
      const errors: string[] = [];
      let success = 0;

      imported.forEach((entry, index) => {
        try {
          // Validate entry structure
          if (!entry.id || !entry.name) {
            errors.push(`Entry ${index + 1}: Missing required fields (id, name)`);
            return;
          }

          // Skip if already exists (could add merge logic here)
          if (existingIds.has(entry.id)) {
            errors.push(`Entry ${index + 1}: Entry with ID ${entry.id} already exists`);
            return;
          }

          existing.push(entry);
          success++;
        } catch (error) {
          errors.push(`Entry ${index + 1}: Invalid entry format`);
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return { success, errors };
    } catch (error) {
      console.error("Error importing entries:", error);
      throw new Error("Failed to import entries: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }

  /**
   * Clear all entries (use with caution)
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing entries:", error);
      throw new Error("Failed to clear entries");
    }
  }

  /**
   * Get statistics
   */
  static getStatistics() {
    const entries = this.getEntries();
    return {
      total: entries.length,
      favorites: entries.filter((e) => e.isFavorite).length,
      byTag: entries.reduce((acc, entry) => {
        entry.tags?.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

