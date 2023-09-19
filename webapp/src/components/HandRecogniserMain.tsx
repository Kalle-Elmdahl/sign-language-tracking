import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
/* import type { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision" */

/* // @ts-expect-error: Let's ignore a compile error like this unreachable code
import externalImport from "https://cdn.skypack.dev/@mediapipe/tasks-vision@latest"

const MediaPipe: any = externalImport */

import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import HandRecogniser from "./HandRecogniser"
import HandIcon from "./icons/HandIcon"
import Hand, { HandPosition } from "../util/Hand"
import HandRecogniserManager from "./HandRecogniserManager"
import HandRecorder from "./HandRecorder"
import { Sequence } from "../util/types"
import SequenceSelector from "./SequenceSelector"
import { SequenceAction, initSequences, saveSequences, sequencesReducer } from "../util/SequenceReducer"

export type Vision = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>

async function createHandLandmarker(vision: Vision) {
  return await /* MediaPipe. */HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `http://localhost:5173/hand_landmarker.task`,
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
      lastVideoTime = video.currentTime
      const detections = handRecogniser.detectForVideo(video, video.currentTime)
      setHands(detections.landmarks.map((hand) => Hand.fromPositions(hand)))
    }

    requestAnimationFrame(detect)
  }

  requestAnimationFrame(detect)
}

export default function HandRecogniserMain({ vision }: HandRecogniserMainProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null)
  const [hands, setHands] = useState<Hand[]>([])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const [sequences, setSequences] = useReducer<React.Reducer<Sequence[], SequenceAction>, Sequence[]>(
    sequencesReducer,
    [],
    initSequences
  )
  const [selectedSequence, setSelectedSequence] = useState<number | null>(null)

  const video = useRef<HTMLVideoElement>(null)
  const lastVideoTime = useRef<number>(0)

  useEffect(() => {
    let streamRef: MediaStream | null = null
    setLoading(true)

    createHandLandmarker(vision)
      .then(setHandLandmarker)
      .then(() => navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } }))
      .then((stream) => {
        streamRef = stream
        setStream(stream)
        stream.getTracks().forEach((track) => (track.enabled = false))
        setLoading(false)
      })
    return () => streamRef?.getTracks().forEach((track) => track.stop())
  }, [])

  const handlePlay = useCallback(() => {
    if (!video.current) return

    video.current?.play()
    stream?.getTracks().forEach((track) => (track.enabled = true))
    TrackHands(video.current as HTMLVideoElement, handLandmarker as HandLandmarker, setHands)
  }, [stream, video.current, handLandmarker, setHands])

  const handlePause = useCallback(() => {
    if (!stream) return
    video.current?.pause()
    stream.getTracks().forEach((track) => (track.enabled = false))
  }, [stream])

  useEffect(() => {
    if (!video.current) return

    video.current.currentTime = lastVideoTime.current
    video.current.srcObject = stream || null
  }, [stream])

  return (
    <>
      <video ref={video} style={{ display: "none" }} width="1280" height="720" autoPlay playsInline />
      {loading ? (
        <div>Loading...</div>
      ) : isPlaying ? (
        <>
          <button onClick={() => setIsPlaying(false)}>Exit sequence</button>
          <HandRecogniserManager
            /* video={video.current as HTMLVideoElement} */
            hands={hands}
            activeSequence={sequences[selectedSequence as number]}
          />
        </>
      ) : (
        <>
          <SequenceSelector {...{ sequences, setSequences, selectedSequence, setSelectedSequence }} />
          {selectedSequence === null || (
            <HandRecorder hands={hands} sequence={sequences[selectedSequence]} setSequence={setSequences} />
          )}
          <button onClick={() => saveSequences(sequences)}>Save sequnces</button>
          {stream?.getTracks().at(0)?.enabled ? (
            <>
              {selectedSequence === null || <button onClick={() => setIsPlaying(true)}>Play sequence</button>}
              <button onClick={handlePause}>Stop Tracking</button>
              <HandRecogniser video={video.current as HTMLVideoElement} hands={hands} />
            </>
          ) : (
            <button onClick={handlePlay}>Start Tracking</button>
          )}
        </>
      )}
    </>
  )
}
