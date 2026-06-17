export type CreateCharacterRequest = {
  roomId: string
  name: string
  isNPC: boolean
}

const BACKEND_PORT = Number(import.meta.env.VITE_API_PORT ?? 4000);

export async function createCharacter(data: CreateCharacterRequest) {
  const res = await fetch("http://localhost:" + BACKEND_PORT + `/rooms/${data.roomId}/characters`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('Token')}`,
    },
    body: JSON.stringify({
      characterName: data.name,
      isNPC: data.isNPC
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