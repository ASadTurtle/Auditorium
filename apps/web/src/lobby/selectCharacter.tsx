import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { CreateCharacter } from "./createCharacter";
import socket from "@/socket";

type SelectCharacterProps = { 
  roomId: string
  characters: {
    id: string;
    name: string;
    isNPC: boolean;
  }[]
}

export function SelectCharacter(props: SelectCharacterProps) {
  const {roomId, characters} = props;
  const [character, setCharacter] = useState<string>("")
  const [pcs, setPcs] = useState<string[]>([])
  const [npcs, setNpcs] = useState<string[]>([]);

  const handleSetCharacter = (newCharacter: string) => {
    if (character) {
      socket.emit("DESELECT_CHARACTER", character);
    }
    setCharacter(newCharacter);
    socket.emit("SELECT_CHARACTER", newCharacter);
  }

  useEffect(() => {
    const filterPcs = characters.filter((c) => !c.isNPC)
      .map((c) => c.name);
    const filterNpcs = characters.filter((c) => c.isNPC)
      .map((c) => c.name);

    setPcs(filterPcs)
    setNpcs(filterNpcs)
  }, [])

  if (pcs.length > 0 || npcs.length > 0) {
    return (
      <Select onValueChange={handleSetCharacter}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select a Character"/>
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectGroup hidden={pcs.length === 0}>
            <SelectLabel>PCs</SelectLabel>
            {/* Should be disabled if character has been selected*/}
            {pcs.map((name) => (
              <SelectItem disabled={name==="Aurelion"}value={name}>{name}</SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup hidden={npcs.length === 0}> {/* Should be hidden if player is not GM*/}
            <SelectSeparator/>
            <SelectLabel>NPCs</SelectLabel>
            {npcs.map((name) => (
              <SelectItem value={name}>{name}</SelectItem>
            ))}
          </SelectGroup>
          <hr />
          <CreateCharacter roomId={roomId} pcs={pcs} setNpcs={setNpcs} setPcs={setPcs} npcs={npcs}/>
        </SelectContent>
      </Select>
    )
  } else {
    return (
      <div className="w-36">
        <CreateCharacter roomId={roomId} pcs={pcs} setNpcs={setNpcs} setPcs={setPcs} npcs={npcs}/>
      </div>
  )
  }

}