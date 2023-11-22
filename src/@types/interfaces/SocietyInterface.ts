import { PlayerInterface } from "./PlayerInterface";

export interface SocietyInterface {
  name: string;
  votedUsers: number;
  users: PlayerInterface[];
}
