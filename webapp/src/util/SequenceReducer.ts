import Hand, { HandPosition } from "./Hand"
import { Element, HandElement, Sequence } from "./types"

const LOCAL_STORAGE_KEY = "__SIGN_LANGUAGE_SEQUENCE"

interface CreateSequenceAction {
  type: "CREATE"
  payload: string
}

interface DeleteSequenceAction {
  type: "DELETE"
  payload: number
}

interface AddElementAction {
  type: "ADD_ELEMENT"
  payload: { sequence: Sequence; element: Element }
}

interface UpdateElementVideo {
  type: "UPDATE_ELEMENT_VIDEO"
  payload: { sequence: Sequence; element: HandElement; video: string }
}

interface RemoveElementAction {
  type: "REMOVE_ELEMENT"
  payload: { sequence: Sequence; index: number }
}

export type SequenceAction =
  | CreateSequenceAction
  | DeleteSequenceAction
  | AddElementAction
  | UpdateElementVideo
  | RemoveElementAction

export function sequencesReducer(state: Sequence[], { type, payload }: SequenceAction) {
  switch (type) {
    case "CREATE":
      return [...state, { name: payload, elements: [] }]

    case "DELETE":
      return state.filter((_, i) => i !== payload)

    case "ADD_ELEMENT":
      return state.map((s) => {
        if (s === payload.sequence)
          return {
            ...s,
            elements: [...s.elements, payload.element],
          }
        return s
      })
    case "UPDATE_ELEMENT_VIDEO":
      return state.map((s) => {
        if (s === payload.sequence)
          return {
            ...s,
            elements: s.elements.map((e) => (e !== payload.element ? e : { ...e, video: payload.video })),
          }
        return s
      })

    case "REMOVE_ELEMENT":
      return state.map((s) => {
        if (s === payload.sequence)
          return {
            ...s,
            elements: s.elements.filter((_, i) => i !== payload.index),
          }
        return s
      })

    default:
      return state
  }
}

interface SequenceStored {
  name: string
  elements: Array<
    | string
    | {
        hands: [HandPosition, HandPosition]
        video: string
      }
  >
}

export function initSequences() {
  const sequences = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "[]") as SequenceStored[]
  return sequences.map((sequence) => ({
    ...sequence,
    elements: sequence.elements.map((element) => {
      if (typeof element === "string") return element
      const [left, right] = element.hands
      return {
        hands: [new Hand(left), new Hand(right)],
        video: element.video,
      }
    }),
  })) satisfies Sequence[]
}

export function saveSequences(sequences: Sequence[]) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sequences))
}
