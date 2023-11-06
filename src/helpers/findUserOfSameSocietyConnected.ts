import { societies } from "../datas/societies";

/**
 * Function that return an array of users connected of the same society
 * @param society the society researched
 * @returns an array of all user of the same society connected
 */
export function findUserOfSameSocietyConnected(society: string) {
  const sameSociety = societies.find((company) => company.name === society)!;
  return sameSociety.users.map((user) => {
    return { ...user, token: "" };
  });
}
