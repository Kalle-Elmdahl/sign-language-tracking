/* import reactLogo from './assets/react.svg' */
import HandRecogniser from "./components/HandRecogniser";
/* import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision" */
import type { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// @ts-expect-error: Let's ignore a compile error like this unreachable code
import externalImport from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const MediaPipe: any = externalImport;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import HandRecogniserMain, { Vision } from "./components/HandRecogniserMain";

async function loadVision() {
  return await MediaPipe.FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
}

function App() {
  const [vision, setVision] = useState<null | Vision>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  useEffect(() => {
    loadVision().then(setVision);
  }, [setVision]);

  if (vision === null) return <div>Loading...</div>;

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
  );
}

export default App;
