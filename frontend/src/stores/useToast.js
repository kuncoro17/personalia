import { create } from "zustand";

export const useToastSlice = create((set) => ({
  message: [],

  setMessage: (message) => {
    set((state) => ({
      message: [...state.message, message],
    }));

    setTimeout(() => {
      set((state) => ({
        message: state.message.filter((m) => m !== message),
      }));
    }, 6000);
  },
  deleteMessage: (message) => {
    set((state) => ({
      message: state.message.filter((msg) => msg !== message),
    }));
  },
}));
