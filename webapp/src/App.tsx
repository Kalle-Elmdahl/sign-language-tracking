/* import reactLogo from './assets/react.svg' */
import HandRecogniser from "./components/HandRecogniser"
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import HandRecogniserLoader, { Vision } from "./components/HandRecogniserLoader"

async function loadVision() {
	return await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
}

function App() {
	const [vision, setVision] = useState<null | Vision>(null)

	useEffect(() => {
		loadVision().then(setVision)
	}, [setVision])

	if (vision === null) return <div>Loading...</div>

	return (
		<div className="App">
			<HandRecogniserLoader vision={vision} />
		</div>
	)
}

export default App
