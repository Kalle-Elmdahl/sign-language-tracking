import Hand, { HandPosition } from "./Hand"
import { Sequence } from "./types"

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
  payload: { sequence: Sequence; element: Hand[] }
}

interface RemoveElementAction {
  type: "REMOVE_ELEMENT"
  payload: { sequence: Sequence; index: number }
}

export type SequenceAction = CreateSequenceAction | DeleteSequenceAction | AddElementAction | RemoveElementAction

export function sequencesReducer(state: Sequence[], { type, payload }: SequenceAction) {
  switch (type) {
    case "CREATE":
      return [...state, { name: payload, elements: [] }]

    case "DELETE":
      return state.filter((_, i) => i !== payload);

    case "ADD_ELEMENT":
      if (payload.element.length !== 2) return state
      return state.map((s) => {
        if (s === payload.sequence)
          return {
            ...s,
            elements: [...s.elements, payload.element as [Hand, Hand]],
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
  elements: [HandPosition, HandPosition][]
}

export function initSequences() {
  const sequences = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "[]") as SequenceStored[]
  return sequences.map((sequence) => ({
    ...sequence,
    elements: sequence.elements.map(([left, right]) => [new Hand(left), new Hand(right)]),
  })) satisfies Sequence[]
}

export function saveSequences(sequences: Sequence[]) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sequences))
}