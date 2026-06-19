import { Server, Socket } from "socket.io";

export function registerCharacterSocketHandlers(io: Server, socket: Socket) {
   socket.on("CREATE_CHARACTER", () => {
    console.log(`CLIENT CREATED NEW CHARACTER`);
  });

  socket.on("SELECT_CHARACTER", (character) => {
    console.log(`CHARACTER SELECTED: ${character.name}`);
  });

  socket.on("DESELECT_CHARACTER", (character) => {
    console.log(`CHARACTER DESELECTED: ${character.name}`);
  });
}