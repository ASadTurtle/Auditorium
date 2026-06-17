import { createCharacter, CreateCharacterRequest } from "@/api/Characters/createCharacter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type CreateCharacterProps = {
  roomId: string 
  pcs: string[]
  setPcs: Dispatch<SetStateAction<string[]>>
  npcs: string[]
  setNpcs: Dispatch<SetStateAction<string[]>>
}

export function CreateCharacter(props: CreateCharacterProps) {
  const { roomId, pcs, setPcs, npcs, setNpcs } = props
  const isDM = true;  // Placeholder for when client detects DM status
  
  const FormSchema = z.object({
    name: z.string().nonempty({
      message: 'Please provide a name',
    }),
    isNPC: z.boolean()
  });
  type CharacterFormValues = z.infer<typeof FormSchema>
  
  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      isNPC: false
    },
  });

  async function onSubmit(req: CharacterFormValues) {
    try {
      await createCharacter({roomId, ...req});
      if (req.isNPC) {
        npcs.push(req.name)
        setNpcs([...npcs])
      } else {
        pcs.push(req.name)
        setPcs([...pcs])
      }
    } catch (error) {
      form.setError("name", {
        type: "validate",
        message: error as string
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="ghost">Create a Character</Button>
      </DialogTrigger>
      <DialogContent 
        aria-describedby={undefined}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Create your Character</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} placeholder="Henry Baker" ref={null} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isNPC"
              render={({ field }) => (
                <FormItem className="flex justify-between py-2">
                  <FormLabel hidden={!isDM}>Is NPC</FormLabel>
                  <FormControl>
                    <Checkbox
                      hidden={!isDM} 
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}  
            />
            <Button size={'lg'} className="w-1/4" type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}