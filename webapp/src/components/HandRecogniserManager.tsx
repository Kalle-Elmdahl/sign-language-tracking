import React, { useEffect, useRef, useState } from "react"
import Hand from "../util/Hand"
import HandIcon from "./icons/HandIcon"
import HandRecogniser from "./HandRecogniser"
import { Sequence } from "../util/types"

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
  const [playingSequenceStep, setPlayingSequenceStep] = useState(activeSequence ? 0 : -1)
  const [introPlayed, setIntroPlayed] = useState<boolean>(false)

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
    const refHands = activeSequence.elements[playingSequenceStep]

    const leftCorrect = hands[0].compare(refHands[0])
    const rightCorrect = hands[1].compare(refHands[1])

    if (leftCorrect && rightCorrect) {
      if (playingSequenceStep === activeSequence.elements.length - 1) return onFinish?.()
      setPlayingSequenceStep((x) => ++x)
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

  if (!introPlayed)
    return (
      <video autoPlay onEnded={() => setIntroPlayed(true)} className="intro-video">
        <source src="https://elmdahl.se/sigma-spegel/Let's_go_to_Bar_Basso%2C_fast_SIGMA.mp4" type="video/mp4" />
      </video>
    )

  return <HandRecogniser video={video} hands={hands} refHand={activeSequence?.elements.at(playingSequenceStep)} />
}
