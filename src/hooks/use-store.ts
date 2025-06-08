import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type BearSlice, createBearSlice } from '../store/bearSlice';
import { createFishSlice, type FishSlice } from '../store/fishSlice';
import { createSyntaxHighlighterSlice, type SyntaxHighlighterSlice } from '../store/syntax-highlighter-slice';

// Create a type for our store that combines all slices
type StoreState = BearSlice & FishSlice & SyntaxHighlighterSlice;

// Create the store
export const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createBearSlice(set, get, api),
      ...createFishSlice(set, get, api),
      ...createSyntaxHighlighterSlice(set, get, api),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        text: state.text,
      }),
    },
  ),
); 