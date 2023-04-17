import React, { useEffect, useRef, useState } from "react"
import Hand from "../util/Hand"
import HandIcon from "./icons/HandIcon"
import HandRecogniser from "./HandRecogniser"
import { Element, Sequence } from "../util/types"

interface HandRecogniserProps {
  video?: HTMLVideoElement
  hands: Hand[]
  activeSequence?: Sequence
}

export default function HandRecogniserManager(props: HandRecogniserProps) {
  const { hands, video, activeSequence } = props
  const handIcon = useRef<SVGSVGElement>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [playingSequenceStep, setPlayingSequenceStep] = useState<number>(activeSequence ? 0 : -1)

  const onFinish = () => {
    setPlayingSequenceStep(0)
    setLoaded(false)
  }

  useEffect(() => {
    if (hands.length === 2) {
      handIcon.current?.classList.add("animate")
      const timeout = setTimeout(() => setLoaded(true), 1000)

      return () => {
        clearTimeout(timeout)
        handIcon.current?.classList.remove("animate")
      }
    }
  }, [hands.length, handIcon.current])

  useEffect(() => {
    if (!loaded || hands.length === 0 || !activeSequence) return
    const currentElement = activeSequence.elements[playingSequenceStep]

    if (typeof currentElement === "string") return
    if (hands.length < currentElement.hands.length) return

    const result =
      hands.length === currentElement.hands.length
        ? hands.every((hand, index) => hand.compare(currentElement.hands[index]))
        : hands.some((hand) => hand.compare(currentElement.hands[0]))

    if (result) {
      if (playingSequenceStep === activeSequence.elements.length - 1) return onFinish()
      setPlayingSequenceStep((x) => x + 1)
    }
  }, [hands, loaded, activeSequence, playingSequenceStep])

  if (!loaded) {
    return (
      <div className="hand-loader">
        <h1>TRY ME!</h1>
        <div>
          <HandIcon className="normal-hand" />
          <HandIcon color="#1935BF" className="loading-hand" ref={handIcon} />
        </div>
        <h2>Show your hands to unlock!</h2>
      </div>
    )
  }

  const currentElement = activeSequence?.elements.at(playingSequenceStep)

  if (typeof currentElement === "string")
    return (
      <video
        key={currentElement}
        autoPlay
        onEnded={(e) => {
          if (!activeSequence) return
          if (playingSequenceStep === activeSequence.elements.length - 1) return onFinish()
          console.log(e.currentTarget.currentTime)
          setPlayingSequenceStep((x) => x + 1)
        }}
        className="video-frame"
      >
        <source src={currentElement} type="video/mp4" />
      </video>
    )

  return (
    <>
      {currentElement?.video && (
        <video key={currentElement.video} autoPlay loop className="frame-overlay-video">
          <source src={currentElement.video} type="video/mp4" />
        </video>
      )}
      <HandRecogniser video={video} hands={hands} refHand={currentElement?.hands} />
    </>
  )
}
