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

  /* const handleUpdateElementVideo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSequence
  } */

  return (
    <>
      <button onClick={handleAdd}>Add position</button>
      {countdown.current >= 0 && <div className="recorder-countdown">{countdown.current}</div>}
      <div className="sequence-previewer">
        <h3>{sequence.name} (Click frame to delete)</h3>
        <div>
          <div className="sequence-previewer-list">
            {sequence.elements.map((element, index) =>
              typeof element === "string" ? (
                <video
                  key={index}
                  width={(175 * 16) / 9}
                  height={175}
                  onClick={() =>
                    setSequence({
                      type: "REMOVE_ELEMENT",
                      payload: { sequence, index },
                    })
                  }
                >
                  <source src={element} type="video/mp4" />
                </video>
              ) : (
                <div key={index}>
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
                  <input type="text" value={element.video} /* onChange={handleUpdateElementVideo} */ />
                </div>
              )
            )}
            <form
              style={{ width: `${(175 * 16) / 9}px` }}
              onSubmit={(e) => {
                e.preventDefault()
                setSequence({
                  type: "ADD_ELEMENT",
                  payload: {
                    sequence,
                    // @ts-expect-error comment
                    element: e.target.video.value,
                  },
                })
              }}
            >
              <input name="video" type="text" placeholder="Add video to sequence" />
              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
