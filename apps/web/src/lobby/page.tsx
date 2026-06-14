import { fetchRoom, FetchRoomRequest, RoomDTO } from "@/api/Rooms/fetchRoom";
import GeneratePage from "@/components/layout/generatePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Users } from "lucide-react";
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
      <GeneratePage title={"Lobby"}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl justify-self-center">{roomData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row gap-4 items-center py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <ScrollText className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle>Description</CardTitle>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et metus blandit, lobortis lacus sed, laoreet orci. Nullam aliquet eleifend odio, in egestas lectus porta sodales. Fusce a nunc feugiat, dapibus ante et, egestas arcu. Aenean odio massa, aliquet vitae lorem a, efficitur convallis odio. Proin sit amet mollis nisi. Donec et risus efficitur, aliquet ante id, suscipit nibh. Aliquam efficitur eros et augue condimentum, ac tempus turpis efficitur. Donec tempor congue lorem, ac ornare ligula ullamcorper aliquet. Vivamus sed nibh purus. Fusce sem erat, elementum quis augue a, cursus aliquet justo. Curabitur hendrerit nisl sed velit auctor pulvinar. Sed ac ultricies tellus.</p>
            <p className="py-4">Integer mattis, lectus iaculis interdum suscipit, purus sapien porta elit, fringilla sagittis velit urna ut sem. Integer et dolor a metus rutrum fringilla in in neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur ornare ac ligula vitae luctus. Proin mollis nisi sit amet nibh ornare euismod. Nullam ullamcorper, purus in pulvinar egestas, urna quam efficitur augue, accumsan facilisis ipsum tortor quis odio. Duis cursus semper mattis. Pellentesque non porta nulla.</p>
          </CardContent>
          <hr />

          <CardHeader>
            <div className="flex flex-row gap-4 items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Users className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle>2/{roomData.players.length + 4} Players</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {roomData.players.map((player) => (
              <div id={player.id} className="justify-self-auto">
                {player.name} | {player.role} | Select a Character | In Lobby
              </div>
            )
          )}
            <div id={"12345"} className="justify-self-auto">
                {"Dummy player"} | {"Player"} | Select a Character | In Lobby
            </div>
            <div id={"12346"} className="justify-self-auto">
                {"Dummy player 2"} | {"Player"} | Select a Character | Offline
            </div>
            <div id={"12347"} className="justify-self-auto">
                {"Dummy player 3"} | {"GM"} | Select a Character | Offline
            </div>
            <div id={"12348"} className="justify-self-auto">
                {"Dummy player 4"} | {"Player"} | Select a Character | Offline
            </div>
          </CardContent>
          <div className="flex flex-cols-2 gap-2 px-4 w-full justify-end">
            <Button size={"lg"}>Join</Button>
            <Button variant={'destructive'} size={"lg"} onClick={() => navigate('/dashboard') } >
              Disconnect
            </Button>
          </div>
        </Card>
      </GeneratePage>
    )
  }

}