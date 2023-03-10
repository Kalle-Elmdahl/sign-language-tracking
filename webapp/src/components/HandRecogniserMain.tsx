import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import HandRecogniser from "./HandRecogniser"
import HandIcon from "./icons/HandIcon"
import Hand from "../util/Hand"
import HandRecogniserLoader from "./HandRecogniserLoader"

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

interface HandRecogniserMainProps {
	vision: Vision
}

function TrackHands(video: HTMLVideoElement, handRecogniser: HandLandmarker, setHands: (hands: Hand[]) => void) {
	let lastVideoTime = 0

	const detect = () => {
        if(video.paused) return
		console.log("Running detect: ", video.ended, video.readyState, video.paused)
		if (video.currentTime !== lastVideoTime) {
			++lastVideoTime
			const detections = handRecogniser.detectForVideo(video, video.currentTime)
			setHands(detections.landmarks.map(hand => Hand.fromPositions(hand)))
		}

		requestAnimationFrame(detect)
	}

	requestAnimationFrame(detect)
}

export default function HandRecogniserMain({ vision }: HandRecogniserMainProps) {
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [loading, setLoading] = useState(false)
	const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null)
	const [hands, setHands] = useState<Hand[]>([])

	const video = useRef<HTMLVideoElement>(null)
	const lastVideoTime = useRef<number>(0)

	useEffect(() => {
		setLoading(true)
		createHandLandmarker(vision)
			.then(setHandLandmarker)
			.then(() => navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } }))
			.then(stream => setStream(stream))
			.then(() => setLoading(false))
	}, [])

	const handlePause = useCallback(() => {
		if (!stream) return
		stream.getTracks().forEach(track => track.stop())
		setStream(null)
		setHandLandmarker(null)
	}, [stream])

	useEffect(() => {
		if (!video.current) return

		video.current.currentTime = lastVideoTime.current
		video.current.srcObject = stream || null
	}, [stream])

	const handleOnLoadedData = () =>
		TrackHands(video.current as HTMLVideoElement, handLandmarker as HandLandmarker, setHands)

	return (
		<div className="hand-recoginser">
			<video
				ref={video}
				style={{ display: "none" }}
				width="1280"
				height="720"
				autoPlay
				playsInline
				onLoadedData={handleOnLoadedData}
			/>
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					<button onClick={handlePause}>Stop</button>
				</>
			)}
			<HandRecogniserLoader video={video.current as HTMLVideoElement} hands={hands} />
		</div>
	)
}
