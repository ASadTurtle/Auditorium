import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { CreateCharacter } from "./createCharacter";

type SelectCharacterProps = { roomId: string }

export function SelectCharacter({ roomId }: SelectCharacterProps) {
  const pcs = ["Strahd", "Edward", "Aurelion", "Brumhilde"] // Placeholder
  const npcs = ["Yousef", "Michael", "Dawnstar", "Lint"] // Placeholder
  const [character, setCharacter] = useState<string>("")

  useEffect(() => {           // For debugging. TODO delete
    console.log(character);
  }, [character])

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
        <SelectGroup hidden> {/* Should be hidden if player is not GM*/}
          <SelectSeparator/>
          <SelectLabel>NPCs</SelectLabel>
          {npcs.map((name) => (
            <SelectItem value={name}>{name}</SelectItem>
          ))}
        </SelectGroup>
        <hr />
        <CreateCharacter roomId={roomId}/>
      </SelectContent>
    </Select>
  )
}