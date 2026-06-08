import { MessageCircle, Users } from 'lucide-react';
import { useSessionStore } from '../store/session-store';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import GeneratePage from '@/components/layout/generatePage';

export default function Dashboard() {
  const { sessionName, connectedPlayers } = useSessionStore();
  const navigate = useNavigate();
  const BACKEND_PORT = Number(import.meta.env.VITE_API_PORT ?? 4000);

  function Logout() {
    fetch('http://localhost:' + BACKEND_PORT + '/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return Promise.reject(data.error)
        } else {
          return Promise.resolve(data.token)
        }
    });
    localStorage.clear();
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <GeneratePage title={'Auditorium'}>
        <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-12">
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
                  <Button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold w-full border border-gray-400 rounded shadow'>
                    Create a room
                  </Button>
                </div>
                <div className='py-1'>
                  <Button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold w-full border border-gray-400 rounded shadow'>
                    Start a room
                  </Button>
                </div>
                <div className='py-1'>
                  <Button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold w-full border border-gray-400 rounded shadow'>
                    Join a room
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 rounded-lg border bg-card p-5 text-card-foreground">
              <div className='grid gap-4 sm:grid-cols-2 items-center'>
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Users className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-semibold">{connectedPlayers} connected players</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Socket events can update this once the real session gateway lands.
                  </p>
                </div>
                <Button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold h-1/3 py-2 px-4 border border-gray-400 rounded shadow'>
                  My rooms
                </Button>
              </div>
            </div>
          </div>
        </section>
      </GeneratePage>
    </main>
  );
}
