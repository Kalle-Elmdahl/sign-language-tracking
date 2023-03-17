import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import HandRecogniser from "./HandRecogniser"
import HandIcon from "./icons/HandIcon"
import Hand from "../util/Hand"
import HandRecogniserLoader from "./HandRecogniserLoader"
import HandRecorder from "./HandRecorder"
import { Sequence } from "../util/types"
import SequenceSelector from "./SequenceSelector"

export type Vision = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>

const LOCAL_STORAGE_KEY = "__SIGN_LANGUAGE_SEQUENCE"

async function createHandLandmarker(vision: Vision) {
  return await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task`,
    },
    runningMode: "VIDEO",
    numHands: 2,
  })
}

interface HandRecogniserMainProps {
  vision: Vision
}

function TrackHands(video: HTMLVideoElement, handRecogniser: HandLandmarker, setHands: (hands: Hand[]) => void) {
  let lastVideoTime = 0

  const detect = () => {
    if (video.paused) return
    if (video.currentTime !== lastVideoTime) {
      ++lastVideoTime
      const detections = handRecogniser.detectForVideo(video, video.currentTime)
      setHands(detections.landmarks.map((hand) => Hand.fromPositions(hand)))
    }

    requestAnimationFrame(detect)
  }

  requestAnimationFrame(detect)
}

interface CreateSequenceAction {
  type: "CREATE"
  payload: string
}

interface AddElementAction {
  type: "ADD_ELEMENT"
  payload: { sequence: Sequence; element: Hand[] }
}

export type SequenceAction = CreateSequenceAction | AddElementAction

function sequencesReducer(state: Sequence[], { type, payload }: SequenceAction) {
  switch (type) {
    case "CREATE":
      return [...state, { name: payload, elements: [] }]

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

    default:
      return state
  }
}

export default function HandRecogniserMain({ vision }: HandRecogniserMainProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null)
  const [hands, setHands] = useState<Hand[]>([])

  const [sequences, setSequences] = useReducer<React.Reducer<Sequence[], SequenceAction>, Sequence[]>(
    sequencesReducer,
    [],
    () => JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
  )
  const [selectedSequence, setSelectedSequence] = useState<number | null>(null)

  const video = useRef<HTMLVideoElement>(null)
  const lastVideoTime = useRef<number>(0)

  useEffect(() => {
    handlePlay()
  }, [])

  const handlePlay = useCallback(() => {
    setLoading(true)
    createHandLandmarker(vision)
      .then(setHandLandmarker)
      .then(() => navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } }))
      .then((stream) => setStream(stream))
      .then(() => setLoading(false))
  }, [stream])

  const handlePause = useCallback(() => {
    if (!stream) return
    stream.getTracks().forEach((track) => track.stop())
    setStream(null)
    setHandLandmarker(null)
  }, [stream])

  const handleSaveSequences = () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sequences))
  }

  useEffect(() => {
    if (!video.current) return

    video.current.currentTime = lastVideoTime.current
    video.current.srcObject = stream || null
  }, [stream])

  const handleOnLoadedData = () =>
    TrackHands(video.current as HTMLVideoElement, handLandmarker as HandLandmarker, setHands)

  return (
    <div className="hand-recoginser">
      <video
        ref={video}
        style={{ display: "none" }}
        width="1280"
        height="720"
        autoPlay
        playsInline
        onLoadedData={handleOnLoadedData}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <SequenceSelector {...{ sequences, setSequences, selectedSequence, setSelectedSequence }} />
          {selectedSequence === null || (
            <HandRecorder hands={hands} sequence={sequences[selectedSequence]} setSequence={setSequences} />
          )}
          <button onClick={handleSaveSequences}>Save sequnces</button>
          {video.current?.paused ? (
            <button onClick={handlePlay}>Start</button>
          ) : (
            <>
              <button onClick={handlePause}>Stop</button>
              <HandRecogniserLoader video={video.current as HTMLVideoElement} hands={hands} />
            </>
          )}
        </>
      )}
    </div>
  )
}
