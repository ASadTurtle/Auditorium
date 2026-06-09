import { fetchRoom, FetchRoomRequest, RoomDTO } from "@/api/Rooms/fetchRoom";
import GeneratePage from "@/components/layout/generatePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function Lobby() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState<RoomDTO | null>(null); // Placeholder until Zustand stores required
  const navigate = useNavigate()

  useEffect(() => {
    const set = async (req: FetchRoomRequest) => {
      try {
        const roomDTO = await fetchRoom(req);
        setRoomData(roomDTO);
      } catch (error) {
        console.error(error)
      }
    }

    if (!roomId) {
      console.error('Something went wrong when loading the lobby page')
      navigate('/dashboard')
    }
    
    set({ roomId } as FetchRoomRequest);
  }, []);

  if (roomData) {
    return (
      <GeneratePage title={roomData.name}>
        <div className="flex flex-cols-2 gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Characters</CardTitle>
            </CardHeader>
            <CardContent>
              {roomData.characters.map((character) => (
                <div id={character.id}>
                  <hr />
                  <div>
                    {character.name} | {character.isNPC}
                  </div>
                </div>
              )
            )}
            <Button>Create a Character</Button>
            </CardContent>
          </Card>

          <Card className="w-2/5 justify-self-end">
            <CardHeader>
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
              {roomData.players.map((player) => (
                <div id={player.id} className="justify-self-auto">
                  <hr />
                  <div>
                    {player.name} | {player.role} | Offline 
                  </div>
                </div>
              )
            )}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-cols-2 gap-4 py-2">
          <Button size={"lg"}>Join</Button>
          <Button size={"lg"}>Disconnect</Button>
        </div>
      </GeneratePage>
    )
  }

}