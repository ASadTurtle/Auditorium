import { createCharacter, CreateCharacterRequest } from "@/api/Characters/createCharacter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

type CreateCharacterProps = { roomId: string }

export function CreateCharacter({ roomId }: CreateCharacterProps) {
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
          const characterId = await createCharacter({roomId, ...req});
          console.log(characterId)
        } catch (error) {
          console.error(error)
        }
      }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="ghost">Create a Character</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your Character</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Henry Baker" ref={null} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isNPC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is NPC</FormLabel>
                    <FormControl>
                      <Checkbox 
                        disabled={!isDM}
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