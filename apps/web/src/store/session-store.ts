import { create } from 'zustand';

type SessionState = {
  sessionName: string;
  connectedPlayers: number;
  setConnectedPlayers: (count: number) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  sessionName: 'Chat MVP Session',
  connectedPlayers: 0,
  setConnectedPlayers: (connectedPlayers) => set({ connectedPlayers }),
}));
