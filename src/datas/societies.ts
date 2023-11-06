import { SocietyInterface } from "../@types/interfaces/SocietyInterface";

export const societies: SocietyInterface[] = [
  {
    name: "winmysale",
    users: [
      {
        name: "Marvin",
        token: "winmysale*|*MARVIN_SOURDON",
        socketId: "111",
        points: 0,
        role: "ADMIN",
      },
      {
        name: "William",
        token: "winmysale*|*WILLIAM_LOREE",
        socketId: "222",
        points: 0,
        role: "ADMIN",
      },
      {
        name: "Enzo",
        token: "winmysale*|*ENZO_MARTINEZ",
        socketId: "333",
        points: 0,
        role: "USER",
      },
      {
        name: "Micka",
        token: "winmysale*|*MICKAEL_GONZALES",
        socketId: "444",
        points: 0,
        role: "USER",
      },
    ],
  },
];
