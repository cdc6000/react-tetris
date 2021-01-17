export const gameStateEnum = {
  menu: 1,
  game: 2,
  gameOver: 3,
  gamePause: 4,
  gameAnimation: 5
}

export const levelSpeed = [
  1000,
  800,
  600,
  500,
  400,
  300,
  200,
  150,
  100,
  50,
]

export const levelScore = [
  500,
  1000,
  2000,
  4000,
  8000,
  12000,
  20000,
  30000,
  50000,
]

export const scoreTable = {
  rows:
  [
    100,
    300,
    700,
    1500,
  ],
  place: 10,
  perHeight: 1,
}

export const cellTypes = [
  //0
  {
    class: "empty"
  },
  //1
  {
    class: "cyan"
  },
  //2
  {
    class: "blue"
  },
  //3
  {
    class: "orange"
  },
  //4
  {
    class: "yellow"
  },
  //5
  {
    class: "green"
  },
  //6
  {
    class: "purple"
  },
  //7
  {
    class: "red"
  },
]

export const figTypes = [
  // 0 [I]
  {
    rotations: [
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ],
      [
        [0, 0], [1, 0], [2, 0], [3, 0],
      ],
    ],
    cellData:
    {
      type: 1,
    },
  },
  // 1 [J]
  {
    rotations: [
      [
        [1, 0],
        [1, 1],
        [0, 2], [1, 2],
      ],
      [
        [0, 0],
        [0, 1], [1, 1], [2, 1],
      ],
      [
        [0, 0], [1, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [0, 0], [1, 0], [2, 0],
        [2, 1],
      ],
    ],
    cellData:
    {
      type: 2,
    },
  },
  // 2 [L]
  {
    rotations: [
      [
        [0, 0],
        [0, 1],
        [0, 2], [1, 2],
      ],
      [
        [0, 0], [1, 0], [2, 0],
        [0, 1],
      ],
      [
        [0, 0], [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [0, 1], [1, 1], [2, 1],
      ],
    ],
    cellData:
    {
      type: 3,
    },
  },
  // 3 [O]
  {
    rotations: [
      [
        [0, 0], [1, 0],
        [0, 1], [1, 1],
      ],
    ],
    cellData:
    {
      type: 4,
    },
  },
  // 4 [S]
  {
    rotations: [
      [
        [1, 0], [2, 0],
        [0, 1], [1, 1],
      ],
      [
        [0, 0],
        [0, 1], [1, 1],
        [1, 2],
      ],
    ],
    cellData:
    {
      type: 5,
    },
  },
  // 5 [T]
  {
    rotations: [
      [
        [1, 0],
        [0, 1], [1, 1], [2, 1],
      ],
      [
        [0, 0],
        [0, 1], [1, 1],
        [0, 2],
      ],
      [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
      ],
      [
        [1, 0],
        [0, 1], [1, 1],
        [1, 2],
      ],
    ],
    cellData:
    {
      type: 6,
    },
  },
  // 6 [Z]
  {
    rotations: [
      [
        [0, 0], [1, 0],
        [1, 1], [2, 1],
      ],
      [
        [1, 0],
        [0, 1], [1, 1],
        [0, 2],
      ],
    ],
    cellData:
    {
      type: 7,
    },
  },
]