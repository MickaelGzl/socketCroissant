import { PlayerInterface } from "../@types/interfaces";
import { societies } from "../datas/societies";

/**
 * Function that return an array of users connected of the same society
 * @param society the society researched
 * @returns an array of all user of the same society connected
 */
export function findUserOfSameSocietyConnected(society: string) {
  const users: PlayerInterface[] = [];
  const sameSociety = societies.find((company) => company.name === society)!;
  sameSociety.users.forEach((user) => {
    if (user.socketId !== "") {
      users.push({ ...user, token: "" });
    }
  });
  return users;
}
