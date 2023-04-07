import React, { useEffect, useRef, useState } from "react"
import Hand from "../util/Hand"
import HandIcon from "./icons/HandIcon"
import HandRecogniser from "./HandRecogniser"
import { Element, Sequence } from "../util/types"

interface HandRecogniserProps {
  video: HTMLVideoElement
  hands: Hand[]
  activeSequence?: Sequence
  onFinish?: () => void
}

export default function HandRecogniserManager(props: HandRecogniserProps) {
  const { hands, video, activeSequence, onFinish } = props
  const handIcon = useRef<SVGSVGElement>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [playingSequenceStep, setPlayingSequenceStep] = useState<number>(activeSequence ? 0 : -1)

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
    if (!loaded || hands.length !== 2 || !activeSequence) return
    const currentElement = activeSequence.elements[playingSequenceStep]

    if (typeof currentElement === "string") return

    const leftCorrect = hands[0].compare(currentElement.hands[0])
    const rightCorrect = hands[1].compare(currentElement.hands[1])

    if (leftCorrect && rightCorrect) {
      if (playingSequenceStep === activeSequence.elements.length - 1) return onFinish?.()
      setPlayingSequenceStep((x) => x + 1)
    }
  }, [hands, loaded, activeSequence, playingSequenceStep])

  if (!loaded) {
    return (
      <div className="hand-loader">
        <h2>Show your hands</h2>
        <div>
          <HandIcon />
          <HandIcon color="#9ad093" className="loading-hand" ref={handIcon} />
        </div>
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
          if (playingSequenceStep === activeSequence.elements.length - 1) return onFinish?.()
          console.log(e.currentTarget.currentTime)
          setPlayingSequenceStep((x) => x + 1)
        }}
        className="intro-video"
      >
        <source src={currentElement} type="video/mp4" />
      </video>
    )

  return <HandRecogniser video={video} hands={hands} refHand={currentElement?.hands} />
}
