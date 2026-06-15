import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SelectCharacter() {
  const pcs = ["Strahd", "Edward", "Aurelion", "Brumhilde"] // Placeholder
  const npcs = ["Yousef", "Michael", "Dawnstar", "Lint"] // Placeholder

  return (
    <Select>
      <SelectTrigger className="w-1/6">
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
        <Button variant={"ghost"} className="w-full">Create a Character</Button>
      </SelectContent>
    </Select>
  )
}