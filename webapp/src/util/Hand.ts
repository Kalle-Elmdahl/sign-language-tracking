interface Coordinate {
  x: number
  y: number
  z: number
}

interface DrawOptions {
  detailed?: boolean
  scaleX?: number
  scaleY?: number
}

export interface HandPosition {
  thumb: Coordinate[]
  indexFinger: Coordinate[]
  middleFinger: Coordinate[]
  ringFinger: Coordinate[]
  pinky: Coordinate[]
}

const defaultDrawOptions = {
  detailed: false,
  scaleX: 1,
  scaleY: 1,
} satisfies DrawOptions

export default class Hand {
  thumb
  indexFinger
  middleFinger
  ringFinger
  pinky

  constructor(positions: HandPosition) {
    this.thumb = positions.thumb
    this.indexFinger = positions.indexFinger
    this.middleFinger = positions.middleFinger
    this.ringFinger = positions.ringFinger
    this.pinky = positions.pinky
  }

  static fromPositions(positions: Coordinate[]) {
    return new Hand({
      thumb: positions.slice(1, 5),
      indexFinger: positions.slice(5, 9),
      middleFinger: positions.slice(9, 13),
      ringFinger: positions.slice(13, 17),
      pinky: positions.slice(17, 21),
    })
  }

  drawHand(context: CanvasRenderingContext2D, drawOptions?: DrawOptions) {
    Hand.drawHandPart(context, this.thumb, drawOptions)
    Hand.drawHandPart(context, this.indexFinger, drawOptions)
    Hand.drawHandPart(context, this.middleFinger, drawOptions)
    Hand.drawHandPart(context, this.ringFinger, drawOptions)
    Hand.drawHandPart(context, this.pinky, drawOptions)
  }

  compare(hand: Hand) {
    let maxDistance = 0.05
    return comparePositions(
      [
        this.thumb[0],
        this.thumb.at(-1) as Coordinate,
        this.indexFinger[0],
        this.indexFinger.at(-1) as Coordinate,
        this.middleFinger[0],
        this.middleFinger.at(-1) as Coordinate,
        this.ringFinger[0],
        this.ringFinger.at(-1) as Coordinate,
        this.pinky[0],
        this.pinky.at(-1) as Coordinate,
      ],
      [
        hand.thumb[0],
        hand.thumb.at(-1) as Coordinate,
        hand.indexFinger[0],
        hand.indexFinger.at(-1) as Coordinate,
        hand.middleFinger[0],
        hand.middleFinger.at(-1) as Coordinate,
        hand.ringFinger[0],
        hand.ringFinger.at(-1) as Coordinate,
        hand.pinky[0],
        hand.pinky.at(-1) as Coordinate,
      ],
      maxDistance
    )
  }

  static drawHandPart(context: CanvasRenderingContext2D, part: Coordinate[], drawOptions?: DrawOptions) {
    if (part.length === 0) throw new Error("Illegal hand part")
    const { scaleX, scaleY } = { ...defaultDrawOptions, ...drawOptions }
    context.beginPath()

    context.moveTo(part[0].x * scaleX, part[0].y * scaleY)
    context.lineTo((part.at(-1)?.x as number) * scaleX, (part.at(-1)?.y as number) * scaleY)
    context.stroke()
  }
}

function comparePositions(pos1: Coordinate[], pos2: Coordinate[], maxDistance: number) {
  for (let i = 0; i < pos1.length; i++) 
    if(distance(pos1[i], pos2[i]) > maxDistance) return false

  return true
}

function distance(pos1: Coordinate, pos2: Coordinate) {
  return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
}

export const refHand = new Hand({
  thumb: [
    {
      x: 0.4759448766708374,
      y: 1.0283405780792236,
      z: -0.03471633419394493,
    },
    {
      x: 0.5245778560638428,
      y: 0.9368402361869812,
      z: -0.05482173711061478,
    },
    {
      x: 0.5589959025382996,
      y: 0.8436746597290039,
      z: -0.07231787592172623,
    },
    {
      x: 0.5933171510696411,
      y: 0.7707279920578003,
      z: -0.0901830643415451,
    },
  ],
  indexFinger: [
    {
      x: 0.4647829234600067,
      y: 0.7504037022590637,
      z: -0.041751470416784286,
    },
    {
      x: 0.48653358221054077,
      y: 0.6052060127258301,
      z: -0.06869260966777802,
    },
    {
      x: 0.49853652715682983,
      y: 0.5186801552772522,
      z: -0.08887263387441635,
    },
    {
      x: 0.5069244503974915,
      y: 0.443703830242157,
      z: -0.10315763205289841,
    },
  ],
  middleFinger: [
    {
      x: 0.4157123565673828,
      y: 0.7408987879753113,
      z: -0.044081784784793854,
    },
    {
      x: 0.4263041615486145,
      y: 0.5750279426574707,
      z: -0.06763944029808044,
    },
    {
      x: 0.43279868364334106,
      y: 0.4725208878517151,
      z: -0.08615104854106903,
    },
    {
      x: 0.4375048875808716,
      y: 0.38741958141326904,
      z: -0.10020727664232254,
    },
  ],
  ringFinger: [
    {
      x: 0.3698554039001465,
      y: 0.7655009031295776,
      z: -0.050282154232263565,
    },
    {
      x: 0.3675815761089325,
      y: 0.6099907755851746,
      z: -0.07497406750917435,
    },
    {
      x: 0.366963267326355,
      y: 0.5141369104385376,
      z: -0.09336184710264206,
    },
    {
      x: 0.36971205472946167,
      y: 0.43207454681396484,
      z: -0.10611337423324585,
    },
  ],
  pinky: [
    {
      x: 0.32675477862358093,
      y: 0.817165732383728,
      z: -0.05925942212343216,
    },
    {
      x: 0.30107539892196655,
      y: 0.7067203521728516,
      z: -0.0850263237953186,
    },
    {
      x: 0.28613168001174927,
      y: 0.632427453994751,
      z: -0.09894216060638428,
    },
    {
      x: 0.27713972330093384,
      y: 0.5593540668487549,
      z: -0.10775266587734222,
    },
  ],
})
