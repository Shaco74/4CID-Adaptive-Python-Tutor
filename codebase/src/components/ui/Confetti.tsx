"use client";

import React from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "usehooks-ts";

interface ConfettiProps {
	onComplete?: () => void;
}

export default function Confetti({ onComplete }: ConfettiProps) {
	const { width, height } = useWindowSize();

	return (
		<ReactConfetti
			width={width}
			height={height}
			recycle={false}
			numberOfPieces={1000}
			tweenDuration={5000}
			onConfettiComplete={onComplete}
		/>
	);
}
