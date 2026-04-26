import { create } from 'zustand';

import type { IssueReport } from '@/src/types';
import { getIssues } from '@/src/lib/supabase/issueService';

type IssueStore = {
  issues: IssueReport[];
  loading: boolean;
  initialized: boolean;
  setIssues: (issues: IssueReport[]) => void;
  updateIssueInState: (issueId: string, updatedIssue: IssueReport) => void;
  addIssueToState: (issue: IssueReport) => void;
  fetchIssues: (enabled: boolean, initialIssues: IssueReport[]) => Promise<void>;
};

export const useIssueStore = create<IssueStore>((set, get) => ({
  issues: [],
  loading: false,
  initialized: false,

  setIssues: (issues) => set({ issues }),

  updateIssueInState: (issueId, updatedIssue) =>
    set((state) => ({
      issues: state.issues.map((i) => (i.id === issueId ? updatedIssue : i)),
    })),

  addIssueToState: (issue) =>
    set((state) => ({
      issues: [issue, ...state.issues],
    })),

  fetchIssues: async (enabled, initialIssues) => {
    const { initialized } = get();
    // Don't re-fetch if already initialized with real data
    if (!enabled) {
      if (!initialized) {
        set({ issues: initialIssues, loading: false });
      }
      return;
    }
    if (initialized) return;

    set({ loading: true });
    try {
      const data = await getIssues();
      set({ issues: data, loading: false, initialized: true });
    } catch (err) {
      console.warn('Failed to load real issues, using demo', err);
      set({ issues: initialIssues, loading: false, initialized: true });
    }
  },
}));
