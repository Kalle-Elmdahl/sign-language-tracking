import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import React, { useCallback, useEffect, useRef, useState } from "react"

async function loadData() {
	const vision = await FilesetResolver.forVisionTasks(
		"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
	)
	const handLandmarker = await HandLandmarker.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath: `https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task`,
		},
		runningMode: "VIDEO",
		numHands: 2,
	})

	return handLandmarker
}

export default function HandRecogniser() {
	const [handLandmarker, setHandLandmarker] = useState<null | HandLandmarker>(null)
	const video = useRef<HTMLVideoElement>(null)
	const lastVideoTime = useRef<number>(-1)
	const shouldRun = useRef<boolean>(false)

	useEffect(() => {
		loadData().then(handLandmarker => setHandLandmarker(handLandmarker))
	}, [setHandLandmarker])

	const predictWebcam = () => {
		console.log("Render loop", shouldRun.current)
		if (!video.current || !handLandmarker || !shouldRun.current) return
		if (video.current.currentTime !== lastVideoTime.current) {
			const detections = handLandmarker.detectForVideo(video.current, video.current.currentTime)
			console.log(detections)
			lastVideoTime.current = video.current.currentTime
		}
		requestAnimationFrame(predictWebcam)
	}

	console.log("shouldRun", shouldRun.current)

	const handleStartVideo = () => {
		shouldRun.current = true
		navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
			if (!video.current) return
			video.current.srcObject = stream
		})
	}
	return (
		<div>
			<button onClick={() => handleStartVideo()}>Start</button>
			<button onClick={() => (shouldRun.current = false)}>Stop</button>
			<video ref={video} width="1280px" height="720px" autoPlay playsInline onLoadedData={predictWebcam} />
			<canvas id="output_canvas" width="1280" height="720" />
		</div>
	)
}
