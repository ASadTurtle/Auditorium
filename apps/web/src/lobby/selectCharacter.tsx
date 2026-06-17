import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CreateCharacter } from "./createCharacter";

type SelectCharacterProps = { roomId: string }

export function SelectCharacter({ roomId }: SelectCharacterProps) {
  const [_character, setCharacter] = useState<string>("")
  const [pcs, setPcs] = useState<string[]>(["Strahd", "Edward", "Aurelion", "Brumhilde"])
  const [npcs, setNpcs] = useState<string[]>(["Yousef", "Michael", "Dawnstar", "Lint"]);

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
        <SelectGroup> {/* Should be hidden if player is not GM*/}
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
}