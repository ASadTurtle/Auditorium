export type CreateRoomRequest = {
  name: string
}

type CreateRoomResponse = {
  roomId: string
}

const BACKEND_PORT = Number(import.meta.env.VITE_API_PORT ?? 4000);

export async function createRoom(data: CreateRoomRequest) {
  const res = await fetch("http://localhost:" + BACKEND_PORT + "/rooms", {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('Token')}`,
    },
    body: JSON.stringify({
      roomName: data.name
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error);
      } else {
        return Promise.resolve(data.id)
      }
    });
  return res;
}