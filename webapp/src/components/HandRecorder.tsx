import React, { useEffect, useRef, useState } from "react"
import Hand from "../util/Hand"
import { Sequence } from "../util/types"
import HandPreview from "./HandPreview"
import { SequenceAction } from "../util/SequenceReducer"

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
        <h3>{sequence.name} (Click frame to delete)</h3>
        {sequence.elements.length === 0 && (
          <p>No frames added to sequence</p>
        )}
        <div>
          <div className="sequence-previewer-list">
            {sequence.elements.map((hands, index) => (
              <HandPreview
                key={index}
                hands={hands}
                width={(175 * 16) / 9}
                height={175}
                onClick={() =>
                  setSequence({
                    type: "REMOVE_ELEMENT",
                    payload: { sequence, index },
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
