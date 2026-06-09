export type FetchRoomRequest = {
  roomId: string
} 

export type RoomDTO = {
  roomId: string;
  name: string;
  owner: string;
  characters: {
    id: string;
    name: string;
    isNPC: boolean;
  }[];
  players: {
    id: string;
    userId: string;
    name: string;
    role: string;
  }[];
}

const BACKEND_PORT = Number(import.meta.env.VITE_API_PORT ?? 4000);

export async function fetchRoom(data: FetchRoomRequest): Promise<RoomDTO> {
  const { roomId } = data;
  const res = await fetch("http://localhost:" + BACKEND_PORT + `/rooms/${roomId}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('Token')}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error);
      } else {
        data.roomDTO.players = data.roomDTO.players.map((player: any) => {
          if (player.role === "GAMEMASTER") {
            return {...player, role: "GM"} 
          }
        })
        return Promise.resolve(data.roomDTO)
      }
    });
  return res;
}