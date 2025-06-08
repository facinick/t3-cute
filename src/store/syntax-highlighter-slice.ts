import { type StateCreator } from 'zustand';

export interface SyntaxHighlighterSlice {
  text: string;
  setText: (text: string) => void;
  clearText: () => void;
}

export const createSyntaxHighlighterSlice: StateCreator<
  SyntaxHighlighterSlice,
  [],
  [],
  SyntaxHighlighterSlice
> = (set) => ({
  text: '',
  setText: (text: string) => set({ text }),
  clearText: () => set({ text: '' }),
}); 