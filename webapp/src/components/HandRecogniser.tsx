import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

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
	const canvas = useRef<HTMLCanvasElement>(null)
	const lastVideoTime = useRef<number>(-1)
	const shouldRun = useRef<boolean>(false)
    const [showCanvas, setShowCanvas] = useState<boolean>(false)
	const context = useMemo(() => canvas.current !== null && canvas.current.getContext("2d"), [canvas])

	useEffect(() => {
		loadData().then(handLandmarker => setHandLandmarker(handLandmarker))
	}, [setHandLandmarker])

	const predictWebcam = () => {
		if (!video.current || !context || !handLandmarker || !shouldRun.current) return
		if (video.current.currentTime !== lastVideoTime.current) {
			const detections = handLandmarker.detectForVideo(video.current, video.current.currentTime)
			console.log(detections)
			lastVideoTime.current = video.current.currentTime
			context.drawImage(video.current, 0, 0)

		}
		requestAnimationFrame(predictWebcam)
	}

	const handleStartVideo = () => {
		shouldRun.current = true
        setShowCanvas(true)
		navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
			if (!video.current) return
			video.current.srcObject = stream
		})
	}

	const handleStopVideo = () => {
		shouldRun.current = false
        setShowCanvas(false)
	}

	return (
		<div>
			<button onClick={() => handleStartVideo()}>Start</button>
			<button onClick={() => handleStopVideo()}>Stop</button>
			<video
				ref={video}
				width="1280px"
				height="720px"
				style={{display: 'none'}}
				autoPlay
				playsInline
				onLoadedData={predictWebcam}
			/>
			{showCanvas && (
					<canvas ref={canvas} id="output_canvas" width="1280" height="720" />
			)}
		</div>
	)
}
