/* import reactLogo from './assets/react.svg' */
import HandRecogniser from "./components/HandRecogniser"
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import HandRecogniserMain, { Vision } from "./components/HandRecogniserMain"

async function loadVision() {
  return await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
}

function App() {
  const [vision, setVision] = useState<null | Vision>(null)
  const [isStarted, setIsStarted] = useState<boolean>(false)

  useEffect(() => {
    loadVision().then(setVision)
  }, [setVision])

  if (vision === null) return <div>Loading...</div>

  return (
    <div className="App">
      {isStarted ? (
        <>
          <button onClick={() => setIsStarted(false)}>Quit</button>
          <HandRecogniserMain vision={vision} />
        </>
      ) : (
        <button onClick={() => setIsStarted(true)}>Start</button>
      )}
    </div>
  )
}

export default App
