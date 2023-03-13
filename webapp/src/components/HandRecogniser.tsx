import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Hand, { refHand } from "../util/Hand"

interface HandRecogniserProps {
	handLandmarker: HandLandmarker | null
	stream: MediaStream | null
}

export default function HandRecogniser({ handLandmarker, stream }: HandRecogniserProps) {
	const video = useRef<HTMLVideoElement>(null)
	const canvas = useRef<HTMLCanvasElement>(null)
	const lastVideoTime = useRef<number>(0)
	const shouldRun = useRef<boolean>(false)
	const context = useMemo(() => {
		if (canvas.current === null) return
		const context = canvas.current.getContext("2d")

		if (context == null) return

		return context
	}, [canvas.current])

	const predictWebcam = () => {
		if (!video.current || !canvas.current || !context || !shouldRun.current || !handLandmarker) return
		if (video.current.currentTime !== lastVideoTime.current) {
			const detections = handLandmarker.detectForVideo(video.current, video.current.currentTime)
			const hands = detections.landmarks.map(hand => Hand.fromPositions(hand))
			console.log(hands.at(0))

			const canvasWidth = canvas.current.width
			const canvasHeight = canvas.current.height
			context.clearRect(0, 0, canvasWidth, canvasHeight)
			context.scale(-1, 1)
			context.translate(-canvasWidth, 0)
			context.lineCap = "round"
			context.strokeStyle = "white"
			context.fillStyle = "yellow"
			const drawOptions = {
				scaleX: canvasWidth,
				scaleY: canvasHeight,
			}

			refHand.drawHandProgress(context, 0.5, drawOptions)
			/* refHand.drawHand(context, drawOptions) */
			context.strokeStyle = "#5EBB45"
			hands.forEach(hand => hand.drawHand(context, drawOptions))

			/* context.globalCompositeOperation = "destination-over"
			context.drawImage(video.current, 0, 0, 1280, 720, 0, 0, canvasWidth, canvasHeight)
			context.globalCompositeOperation = "source-over"
 */
			context.setTransform(1, 0, 0, 1, 0, 0)
			lastVideoTime.current = video.current.currentTime
		}
		requestAnimationFrame(predictWebcam)
	}

	useEffect(() => {
		if (!video.current || !canvas.current) return
		shouldRun.current = !!stream

		video.current.currentTime = lastVideoTime.current
		video.current.srcObject = stream || null
	}, [stream])

	useEffect(() => {
		const handleResize = () => {
			console.log("rezie")
			if (!canvas.current) return
			canvas.current.width = window.innerWidth
			canvas.current.height = (window.innerWidth * 9) / 16
		}
		window.addEventListener("resize", handleResize)
		handleResize()
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return (
		<div>
			<video
				ref={video}
				style={{ display: "none" }}
				width="1280"
				height="720"
				autoPlay
				playsInline
				onLoadedData={predictWebcam}
			/>
			<canvas ref={canvas} style={stream ? undefined : { display: "none" }} />
		</div>
	)
}
