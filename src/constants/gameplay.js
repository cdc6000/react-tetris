export const figureType = {
  none: "none",
  I: "I",
  J: "J",
  L: "L",
  O: "O",
  S: "S",
  T: "T",
  Z: "Z",
};

export const cellType = {
  empty: "empty",
  cyan: "cyan",
  blue: "blue",
  orange: "orange",
  yellow: "yellow",
  green: "green",
  purple: "purple",
  red: "red",
};

export const cellTypeData = {
  [cellType.empty]: {
    class: "empty",
  },
  [cellType.cyan]: {
    class: "cyan",
  },
  [cellType.blue]: {
    class: "blue",
  },
  [cellType.orange]: {
    class: "orange",
  },
  [cellType.yellow]: {
    class: "yellow",
  },
  [cellType.green]: {
    class: "green",
  },
  [cellType.purple]: {
    class: "purple",
  },
  [cellType.red]: {
    class: "red",
  },
};


export const figureTypeData = {
  [figureType.I]: {
    //prettier-ignore
    rotations: [
      [

        [0, 1], [1, 1], [2, 1], [3, 1],
      ],
      [
                        [2, 0],
                        [2, 1],
                        [2, 2],
                        [2, 3],
      ],
      [


        [0, 2], [1, 2], [2, 2], [3, 2],
      ],
      [
                [1, 0],
                [1, 1],
                [1, 2],
                [1, 3],
      ],
    ],
    //prettier-ignore
    rotationData: [
      {
        offsets: [[ 0, 0], [-1, 0], [ 2, 0], [-1, 1], [ 2, 1]],
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1, 0], [ 1, 2], [ 1,-1]],
      },
      {
        offsets: [[ 0, 0], [ 2, 0], [-1, 0], [ 2, 0], [-1, 0]],
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0,-1], [ 0, 2]],
      },
    ],
    cellData: {
      type: cellType.cyan,
    },
  },
  [figureType.J]: {
    //prettier-ignore
    rotations: [
      [
        [0, 0],
        [0, 1], [1, 1], [2, 1],
      ],
      [
                [1, 0], [2, 0],
                [1, 1],
                [1, 2],
      ],
      [

        [0, 1], [1, 1], [2, 1],
                        [2, 2],
      ],
      [
                [1, 0],
                [1, 1],
        [0, 2], [1, 2],
      ],
    ],
    //prettier-ignore
    rotationData: [
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]],
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]],
      },
    ],
    cellData: {
      type: cellType.blue,
    },
  },
  [figureType.L]: {
    //prettier-ignore
    rotations: [
      [
                        [2, 0],
        [0, 1], [1, 1], [2, 1],
      ],
      [
                [1, 0],
                [1, 1],
                [1, 2], [2, 2],
      ],
      [

        [0, 1], [1, 1], [2, 1],
        [0, 2],
      ],
      [
        [0, 0], [1, 0],
                [1, 1],
                [1, 2],
      ],
    ],
    //prettier-ignore
    rotationData: [
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]],
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]],
      },
    ],
    cellData: {
      type: cellType.orange,
    },
  },
  [figureType.O]: {
    //prettier-ignore
    rotations: [
      [
        [0, 0], [1, 0],
        [0, 1], [1, 1],
      ],
      [
        [0, 0], [1, 0],
        [0, 1], [1, 1],
      ],
      [
        [0, 0], [1, 0],
        [0, 1], [1, 1],
      ],
      [
        [0, 0], [1, 0],
        [0, 1], [1, 1],
      ],
    ],
    //prettier-ignore
    rotationData: [
      {
        offsets: [[ 0, 0]],
      },
      {
        offsets: [[ 0, 0]],
      },
      {
        offsets: [[ 0, 0]],
      },
      {
        offsets: [[ 0, 0]],
      },
    ],
    cellData: {
      type: cellType.yellow,
    },
  },
  [figureType.S]: {
    //prettier-ignore
    rotations: [
      [
                [1, 0], [2, 0],
        [0, 1], [1, 1],
      ],
      [
                [1, 0],
                [1, 1], [2, 1],
                        [2, 2],
      ],
      [

                [1, 1], [2, 1],
        [0, 2], [1, 2],
      ],
      [
        [0, 0],
        [0, 1], [1, 1],
                [1, 2],
      ],
    ],
    //prettier-ignore
    rotationData: [
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]],
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]],
      },
    ],
    cellData: {
      type: cellType.green,
    },
  },
  [figureType.T]: {
    //prettier-ignore
    rotations: [
      [
                [1, 0],
        [0, 1], [1, 1], [2, 1],
      ],
      [
                [1, 0],
                [1, 1], [2, 1],
                [1, 2],
      ],
      [

        [0, 1], [1, 1], [2, 1],
                [1, 2],
      ],
      [
                [1, 0],
        [0, 1], [1, 1],
                [1, 2],
      ],
    ],
    //prettier-ignore
    rotationData: [
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]],
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]],
      },
    ],
    cellData: {
      type: cellType.purple,
    },
  },
  [figureType.Z]: {
    //prettier-ignore
    rotations: [
      [
        [0, 0], [1, 0],
                [1, 1], [2, 1],
      ],
      [
                        [2, 0],
                [1, 1], [2, 1],
                [1, 2],
      ],
      [

        [0, 1], [1, 1],
                [1, 2], [2, 2],
      ],
      [
                [1, 0],
        [0, 1], [1, 1],
        [0, 2],
      ],
    ],
    //prettier-ignore
    rotationData: [
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]],
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]],
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]],
      },
    ],
    cellData: {
      type: cellType.red,
    },
  },
};

export const actionType = {
  clearLines: "clearLines",
  softDrop: "softDrop",
  hardDrop: "hardDrop",
};

export const gameMode = {
  none: 0,
  classic: "classic",
};

export const gameState = {
  pause: 1,
  play: 2,
};
