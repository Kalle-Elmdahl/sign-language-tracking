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
      if (hands.length !== 2) return alert("Two hands were not visible program will ignore this recording")
      setSequence({
        type: "ADD_ELEMENT",
        payload: {
          sequence,
          element: {
            hands: hands as [Hand, Hand],
          },
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

  const handleUpdateElementVideo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSequence
  }

  return (
    <>
      <button onClick={handleAdd}>Add position</button>
      {countdown.current >= 0 && <div className="recorder-countdown">{countdown.current}</div>}
      <div className="sequence-previewer">
        <h3>{sequence.name} (Click frame to delete)</h3>
        {sequence.elements.length === 0 && <p>No frames added to sequence</p>}
        <div>
          <div className="sequence-previewer-list">
            {sequence.elements.map((element, index) =>
              typeof element === "string" ? (
                <video width={(175 * 16) / 9} height={175}>
                  <source src={element} type="video/mp4" />
                </video>
              ) : (
                <>
                  <HandPreview
                    key={index}
                    hands={element.hands}
                    width={(175 * 16) / 9}
                    height={175}
                    onClick={() =>
                      setSequence({
                        type: "REMOVE_ELEMENT",
                        payload: { sequence, index },
                      })
                    }
                  />
                  <p>With video</p>
                  <input type="text" value={element.video} onChange={handleUpdateElementVideo} />
                </>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
