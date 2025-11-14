/**
 * @deprecated Use EntryService from @/lib/entry-service instead
 * This file is kept for backward compatibility
 */
import { EntryService } from "@/lib/entry-service";
import { SlamBookEntry } from "@/types/slambook";

export const getEntries = (): SlamBookEntry[] => {
  return EntryService.getEntries();
};

export const saveEntry = (entry: SlamBookEntry): void => {
  EntryService.saveEntry(entry);
};

export const deleteEntry = (id: string): void => {
  EntryService.deleteEntry(id);
};

export const getEntryById = (id: string): SlamBookEntry | undefined => {
  return EntryService.getEntryById(id);
};
