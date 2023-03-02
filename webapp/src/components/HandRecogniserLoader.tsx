import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import HandRecogniser from "./HandRecogniser"

export type Vision = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>

async function createHandLandmarker(vision: Vision) {
	return await HandLandmarker.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath: `https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task`,
		},
		runningMode: "VIDEO",
		numHands: 2,
	})
}

interface HandRecogniserLoaderProps {
	vision: Vision
}

export default function HandRecogniserLoader({ vision }: HandRecogniserLoaderProps) {
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [loading, setLoading] = useState(false)
	const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null)
	const handlePlay = useCallback(() => {
		setLoading(true)
		createHandLandmarker(vision)
			.then(setHandLandmarker)
			.then(() => navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } }))
			.then(stream => setStream(stream))
			.then(() => setLoading(false))
	}, [setStream, vision])

	const handlePause = useCallback(() => {
		if (!stream) return
		stream.getTracks().forEach(track => track.stop())
		setStream(null)
		setHandLandmarker(null)
	}, [stream])

	return (
		<div className="hand-recoginser">
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					<button onClick={handlePlay}>Start</button>
					<button onClick={handlePause}>Stop</button>
				</>
			)}
			<HandRecogniser handLandmarker={handLandmarker} stream={stream} />
		</div>
	)
}
