import { MessageCircle, Users } from 'lucide-react';
import { useSessionStore } from './store/session-store';

export function App() {
  const { sessionName, connectedPlayers } = useSessionStore();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-12">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Auditorium
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Immersive TTRPG chat sessions for players and GameMasters.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            This scaffold is ready for the chat MVP: React, TypeScript, Shadcn styling, Zustand
            state, Socket.IO, Express, Prisma, and PostgreSQL.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold">{sessionName}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Session state is currently local and ready to be wired to the API.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold">{connectedPlayers} connected players</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Socket events can update this once the real session gateway lands.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
