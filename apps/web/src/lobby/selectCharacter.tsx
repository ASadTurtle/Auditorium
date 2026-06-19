import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { CreateCharacter } from "./createCharacter";
import socket from "@/socket";

export type Character = {
  id: string;
  name: string;
  isNPC: boolean;
}

type SelectCharacterProps = { 
  roomId: string
  characters: Character[]
}

export function SelectCharacter(props: SelectCharacterProps) {
  const {roomId, characters: charactersDTO } = props;
  const [characters, setCharacters] = useState<Character[]>([])
  const [character, setCharacter] = useState<Character>()

  const handleSetCharacter = (selectedCharacterId: string) => {
    if (character) {
      socket.emit("DESELECT_CHARACTER", character);
    }
    const newCharacter = characters.find((c) => c.id === selectedCharacterId)
    setCharacter(newCharacter);
    socket.emit("SELECT_CHARACTER", newCharacter);
  }

  useEffect(() => {
    setCharacters(charactersDTO);
  }, [])

  if (characters.length > 0) {
    return (
      <Select onValueChange={handleSetCharacter}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select a Character"/>
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectGroup hidden={characters.filter((c) => !c.isNPC).length === 0}>
            <SelectLabel>PCs</SelectLabel>
            {/* Should be disabled if character has been selected*/}
            {characters.filter((c) => !c.isNPC)
              .map((character) => (
              <SelectItem value={character.id}>{character.name}</SelectItem>
            ))}
          </SelectGroup>
            {/* Should be hidden if player is not GM*/}
          <SelectGroup hidden={characters.filter((c) => c.isNPC).length === 0}>
            <SelectLabel>NPCs</SelectLabel>
            {/* Should be disabled if character has been selected*/}
            {characters.filter((c) => c.isNPC)
              .map((character) => (
              <SelectItem value={character.id}>{character.name}</SelectItem>
            ))}
          </SelectGroup>
          <hr />
          <CreateCharacter roomId={roomId} characters={characters} setCharacters={setCharacters}/>
        </SelectContent>
      </Select>
    )
  } else {
    return (
      <div className="w-36">
        <CreateCharacter roomId={roomId} characters={characters} setCharacters={setCharacters}/>
      </div>
  )
  }

}