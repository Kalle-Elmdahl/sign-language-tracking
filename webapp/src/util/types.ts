import Hand from "./Hand"

export interface HandElement {
  hands: [Hand, Hand]
  video?: string
}

export type VideoElement = string

export type Element = HandElement | VideoElement

export interface Sequence {
  name: string
  elements: Array<Element>
}
