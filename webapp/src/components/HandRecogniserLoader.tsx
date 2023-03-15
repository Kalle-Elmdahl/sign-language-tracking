import React, { useEffect, useRef, useState } from "react"
import Hand from "../util/Hand"
import HandIcon from "./icons/HandIcon"
import HandRecogniser from "./HandRecogniser"

interface HandRecogniserProps {
	video: HTMLVideoElement
	hands: Hand[]
}

export default function HandRecogniserLoader({ video, hands }: HandRecogniserProps) {
	const handIcon = useRef<SVGSVGElement>(null)
	const [loaded, setLoaded] = useState<boolean>(false)

	useEffect(() => {
		if (hands.length === 2) {
			handIcon.current?.classList.add("animate")
			const timeout = setTimeout(() => setLoaded(true), 1000)

			return () => {
				clearTimeout(timeout)
				handIcon.current?.classList.remove("animate")
			}
		} else setLoaded(false)
	}, [hands.length, handIcon.current])

	if (!loaded) {
		return (
			<div className="hand-loader">
				<h2>Show your hands</h2>
				<div>
					<HandIcon />
					<HandIcon color="#9ad093" className="loading-hand" ref={handIcon} />
				</div>
			</div>
		)
	}
	return <HandRecogniser video={video} hands={hands} />
}
