import React, { useState } from "react"
import { Sequence } from "../util/types"
import { SequenceAction } from "../util/SequenceReducer"

interface SequenceSelectorProps {
  sequences: Sequence[]
  setSequences: React.Dispatch<SequenceAction>
  selectedSequence: null | number
  setSelectedSequence: React.Dispatch<React.SetStateAction<number | null>>
}

export default function SequenceSelector(props: SequenceSelectorProps) {
  const { sequences, setSequences, setSelectedSequence, selectedSequence } = props
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [newSequenceName, setNewSequenceName] = useState("")

  const handleNewSequence = () => {
    setSequences({ type: "CREATE", payload: newSequenceName })
    setNewSequenceName("")
  }

  const handleSelect = (index: typeof selectedSequence) => {
    setSelectedSequence(index)
    setIsOpen(false)
  }

  const handleDelete = (payload: number) => () => setSequences({type: 'DELETE', payload})
 
  if (!isOpen) return <button onClick={() => setIsOpen(true)}>View Sequences</button>

  return (
    <>
      <div className="sequence-selector-backdrop" onClick={() => setIsOpen(false)} />
      <div className="sequence-selector">
        <button onClick={() => setIsOpen(false)}>Close</button>
        <div>
          <input
            placeholder="Sequence name"
            type="text"
            value={newSequenceName}
            onChange={(e) => setNewSequenceName(e.target.value)}
          />
          <button onClick={handleNewSequence}>Add new sequence</button>
        </div>
        <h2>Your sequences</h2>
        <div className="sequences">
          {sequences.map((sequence, index) => (
            <div key={sequence.name}>
              <p>{sequence.name} </p>
              <div className="actions">
                <button onClick={handleDelete(index)}>Remove</button>
                {selectedSequence === index ? (
                  <button onClick={() => handleSelect(null)}>Deselect</button>
                ) : (
                  <button onClick={() => handleSelect(index)}>Select</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
