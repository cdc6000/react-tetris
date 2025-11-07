const figureType = {
  none: 0,
  "I-shape": 1,
  "J-shape": 2,
  "L-shape": 3,
  "square-2x2": 4,
  "S-shape": 5,
  "T-shape": 6,
  "Z-shape": 7,
};

const figureTypeData = {
  [figureType["I-shape"]]: {
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
        offsets: [[ 0, 0], [-1, 0], [ 2, 0], [-1, 1], [ 2, 1]]
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1, 0], [ 1, 2], [ 1,-1]]
      },
      {
        offsets: [[ 0, 0], [ 2, 0], [-1, 0], [ 2, 0], [-1, 0]]
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0,-1], [ 0, 2]]
      },
    ],
    cellData: {
      type: 1,
    },
  },
  [figureType["J-shape"]]: {
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
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]]
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]]
      },
    ],
    cellData: {
      type: 2,
    },
  },
  [figureType["L-shape"]]: {
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
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]]
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]]
      },
    ],
    cellData: {
      type: 3,
    },
  },
  [figureType["square-2x2"]]: {
    //prettier-ignore
    rotations: [
      [
        [0, 0], [1, 0],
        [0, 1], [1, 1],
      ],
    ],
    cellData: {
      type: 4,
    },
  },
  [figureType["S-shape"]]: {
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
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]]
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]]
      },
    ],
    cellData: {
      type: 5,
    },
  },
  [figureType["T-shape"]]: {
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
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]]
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]]
      },
    ],
    cellData: {
      type: 6,
    },
  },
  [figureType["Z-shape"]]: {
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
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]]
      },
      {
        offsets: [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]]
      },
      {
        offsets: [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]]
      },
    ],
    cellData: {
      type: 7,
    },
  },
};

export default Object.assign(figureType, { figureTypeData });
