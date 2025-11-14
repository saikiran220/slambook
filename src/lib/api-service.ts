import { api } from "./api";
import { SlamBookEntry } from "@/types/slambook";

/**
 * API Service - Handles all API calls to the backend
 */
export class ApiService {
  /**
   * Get all entries for the current user
   */
  static async getEntries(): Promise<SlamBookEntry[]> {
    const response = await api.get("/entries");
    return this.mapEntriesFromApi(response.data);
  }

  /**
   * Get a single entry by ID
   */
  static async getEntryById(id: string): Promise<SlamBookEntry> {
    const response = await api.get(`/entries/${id}`);
    return this.mapEntryFromApi(response.data);
  }

  /**
   * Create a new entry
   */
  static async createEntry(entry: Omit<SlamBookEntry, "id" | "createdAt" | "updatedAt" | "user_id">): Promise<SlamBookEntry> {
    const response = await api.post("/entries", this.mapEntryToApi(entry));
    return this.mapEntryFromApi(response.data);
  }

  /**
   * Update an existing entry
   */
  static async updateEntry(id: string, entry: Partial<SlamBookEntry>): Promise<SlamBookEntry> {
    const response = await api.put(`/entries/${id}`, this.mapEntryToApi(entry as SlamBookEntry));
    return this.mapEntryFromApi(response.data);
  }

  /**
   * Delete an entry
   */
  static async deleteEntry(id: string): Promise<void> {
    await api.delete(`/entries/${id}`);
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(id: string): Promise<SlamBookEntry> {
    const response = await api.patch(`/entries/${id}/favorite`);
    return this.mapEntryFromApi(response.data);
  }

  /**
   * Get statistics
   */
  static async getStatistics() {
    const response = await api.get("/entries/stats/statistics");
    return response.data;
  }

  /**
   * Export entries (get all and return as JSON string)
   */
  static async exportEntries(): Promise<string> {
    const entries = await this.getEntries();
    return JSON.stringify(entries, null, 2);
  }

  /**
   * Import entries (create multiple entries)
   */
  static async importEntries(entries: SlamBookEntry[]): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    for (const entry of entries) {
      try {
        await this.createEntry(entry);
        success++;
      } catch (error: any) {
        errors.push(`Entry ${entry.name}: ${error.response?.data?.detail || "Failed to import"}`);
      }
    }

    return { success, errors };
  }

  /**
   * Map API response to frontend entry format
   */
  private static mapEntryFromApi(apiEntry: any): SlamBookEntry {
    return {
      id: apiEntry.id,
      name: apiEntry.name,
      nickname: apiEntry.nickname,
      birthday: apiEntry.birthday,
      contactNumber: apiEntry.contact_number,
      likes: apiEntry.likes || "",
      dislikes: apiEntry.dislikes || "",
      favoriteMovie: apiEntry.favorite_movie || "",
      favoriteFood: apiEntry.favorite_food || "",
      about: apiEntry.about,
      message: apiEntry.message,
      tags: apiEntry.tags || [],
      isFavorite: apiEntry.is_favorite || false,
      createdAt: apiEntry.created_at,
      updatedAt: apiEntry.updated_at,
    };
  }

  /**
   * Map entries array from API
   */
  private static mapEntriesFromApi(apiEntries: any[]): SlamBookEntry[] {
    return apiEntries.map((entry) => this.mapEntryFromApi(entry));
  }

  /**
   * Map frontend entry format to API format
   */
  private static mapEntryToApi(entry: SlamBookEntry | Partial<SlamBookEntry>): any {
    return {
      name: entry.name,
      nickname: entry.nickname,
      birthday: entry.birthday,
      contact_number: entry.contactNumber,
      likes: entry.likes || null,
      dislikes: entry.dislikes || null,
      favorite_movie: entry.favoriteMovie || null,
      favorite_food: entry.favoriteFood || null,
      about: entry.about,
      message: entry.message,
      tags: entry.tags || null,
      is_favorite: entry.isFavorite || false,
    };
  }
}

