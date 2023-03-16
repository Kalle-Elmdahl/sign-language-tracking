import React, { useState } from "react"
import { Sequence } from "../util/types"

interface SequenceSelectorProps {
	sequences: Sequence[]
	setSequences: React.Dispatch<React.SetStateAction<Sequence[]>>
	selectedSequence: null | number
	setSelectedSequence: React.Dispatch<React.SetStateAction<number | null>>
}

export default function SequenceSelector(props: SequenceSelectorProps) {
	const { sequences, setSequences, setSelectedSequence, selectedSequence } = props
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [newSequenceName, setNewSequenceName] = useState("")

	const handleNewSequence = () => {
		setSequences(sequences => [...sequences, { name: newSequenceName, elements: [] }])
		setNewSequenceName("")
	}

	const handleSelect = (index: typeof selectedSequence) => {
		setSelectedSequence(index)
		setIsOpen(false)
	}

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
						onChange={e => setNewSequenceName(e.target.value)}
					/>
					<button onClick={handleNewSequence}>Add new sequence</button>
				</div>
				<h2>Your sequences</h2>
				{sequences.map((sequence, index) => (
					<div key={sequence.name}>
						{sequence.name}{" "}
						{selectedSequence === index ? (
							<button onClick={() => handleSelect(null)}>Deselect</button>
						) : (
							<button onClick={() => handleSelect(index)}>Select</button>
						)}
					</div>
				))}
			</div>
		</>
	)
}