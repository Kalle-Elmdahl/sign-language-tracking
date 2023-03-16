import React from "react"
import Hand from "../util/Hand"
import { Sequence } from "../util/types"

interface HandRecorderProps {
	hands: Hand[]
	sequence: Sequence
}

export default function HandRecorder(props: HandRecorderProps) {
	const { hands } = props
	return (
		<div>
			<button>Add position</button>
			HandRecorder
		</div>
	)
}
