/**
 * Find the room where the socket is connected and send it
 * @param socket the socket
 * @returns the room where the socket is connected
 */
export function getSocketRoom(socket: any): string {
  return Array.from(socket.rooms).find((room) => room !== socket.id) as string;
}
