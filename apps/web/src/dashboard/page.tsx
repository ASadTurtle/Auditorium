import { MessageCircle, Users } from 'lucide-react';
import { useSessionStore } from '../store/session-store';
import { Button } from '@/components/ui/button';
import GeneratePage from '@/components/layout/generatePage';
import { CreateRoom } from './createRoom';

export default function Dashboard() {
  const { sessionName } = useSessionStore();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <GeneratePage title='Auditorium'>
        <section className="mx-auto flex w-full max-w-5xl flex-col justify-center gap-8 px-6 py-12">
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              Immersive TTRPG chat sessions for players and GameMasters.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              This scaffold is ready for the chat MVP: React, TypeScript, Shadcn styling, Zustand
              state, Socket.IO, Express, Prisma, and PostgreSQL.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <div className="grid gap-4 sm:grid-cols-2 rounded-lg border bg-card p-5 text-card-foreground">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold">{sessionName}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Session state is currently local and ready to be wired to the API.
                </p>
              </div>
              <div className='flex-row -mx-2 px-2 overflow-hidden'>
                <div className='py-1'>
                  <CreateRoom/>
                </div>
                <div className='py-1'>
                  <Button className='w-full py-5'>
                    Start a room
                  </Button>
                </div>
                <div className='py-1'>
                  <Button className='w-full py-5'>
                    Join a room
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 rounded-lg border bg-card p-5 text-card-foreground">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold">12,337 regstered players</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Socket events can update this once the real session gateway lands.
                </p>
              </div>
              <div className='flex-row -mx-2 px-2 overflow-hidden self-center'>
                <div className='py-1'>
                  <Button className='w-full py-5'>
                    My Rooms
                  </Button>
                </div>
                <div className='py-1'>
                  <Button className='w-full py-5'>
                    My Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </GeneratePage>
    </main>
  );
}
