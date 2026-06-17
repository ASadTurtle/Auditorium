import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CreateCharacter } from "./createCharacter";

type SelectCharacterProps = { roomId: string }

export function SelectCharacter({ roomId }: SelectCharacterProps) {
  const [_character, setCharacter] = useState<string>("")
  const [pcs, setPcs] = useState<string[]>([])
  const [npcs, setNpcs] = useState<string[]>([]);

  if (pcs.length > 0 || npcs.length > 0) {
    return (
      <Select onValueChange={setCharacter}>
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