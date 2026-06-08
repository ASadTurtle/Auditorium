import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from 'zod';
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  name: z.string().nonempty({
    message: 'Please provide a name',
  })
});

async function onSubmit() {
  // Implementation for onSubmit
}

export function CreateRoom() {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Create-Room-Button" className="w-full py-5">
          Create a Room
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a new Room</DialogTitle>
          <DialogDescription>
            Choose a name for your room, then submit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            className="w-2/3 space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Strahd's Gameroom!" ref={null} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button size={'lg'} className="w-1/4" type="submit">Start</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}