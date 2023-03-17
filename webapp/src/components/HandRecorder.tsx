import React, { useEffect, useRef, useState } from "react"
import Hand from "../util/Hand"
import { Sequence } from "../util/types"
import { SequenceAction } from "./HandRecogniserMain"
import HandPreview from "./HandPreview"

interface HandRecorderProps {
  hands: Hand[]
  sequence: Sequence
  setSequence: React.Dispatch<SequenceAction>
}

export default function HandRecorder(props: HandRecorderProps) {
  const { hands, sequence, setSequence } = props
  const countdown = useRef<number>(-2)

  useEffect(() => {
    if (countdown.current === 0) {
      countdown.current = -1
      setSequence({
        type: "ADD_ELEMENT",
        payload: {
          sequence,
          element: hands,
        },
      })
    }
  }, [hands, countdown.current])

  const handleAdd = () => {
    countdown.current = 5
    const invl = setInterval(() => {
      if (countdown.current-- === -1) clearInterval(invl)
    }, 1000)
  }

  console.log(sequence)

  return (
    <>
      <button onClick={handleAdd}>Add position</button>
      {countdown.current >= 0 && <div className="recorder-countdown">{countdown.current}</div>}
      <div className="sequence-previewer">
        <h5>{sequence.name}</h5>
        <div>
          <div className="sequence-previewer-list">
            {sequence.elements.map((hands, index) => (
              <HandPreview key={index} hands={hands} width={300} height={(300 * 9) / 16} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
