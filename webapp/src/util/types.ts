import Hand from "./Hand"

export interface Sequence {
    name: string
    elements: [Hand | null, Hand | null][]
}