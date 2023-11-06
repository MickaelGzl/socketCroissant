export interface PlayerInterface {
  name: string;
  token: string;
  socketId: string;
  points: number;
  role: "ADMIN" | "USER";
}
