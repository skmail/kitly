import create from "zustand";

import { subscribeWithSelector } from "zustand/middleware";
import { GroupStoreState } from "./types";

export const useGroupStore = create(
  subscribeWithSelector<GroupStoreState>((set) => ({
    activeGroupId: undefined,
    setActiveGroupId: (activeGroupId) =>
      set((state) => ({
        ...state,
        activeGroupId,
      })),
  }))
);
