"use client"

import { Progress as ChakraProgress } from "@chakra-ui/react"
import * as React from "react"

export interface ProgressBarProps extends ChakraProgress.TrackProps {
  type?: "linear" | "circular"
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(props, ref) {
    const { ...rest } = props
    return (
      <ChakraProgress.Track {...rest} ref={ref}>
        <ChakraProgress.Range />
      </ChakraProgress.Track>
    )
  },
)

export interface ProgressLabelProps extends ChakraProgress.LabelProps {
  info?: React.ReactNode
}

export const ProgressLabel = React.forwardRef<
  HTMLDivElement,
  ProgressLabelProps
>(function ProgressLabel(props, ref) {
  const { children, info, ...rest } = props
  return (
    <ChakraProgress.Label {...rest} ref={ref}>
      {children}
      {info && <ChakraProgress.ValueText>{info}</ChakraProgress.ValueText>}
    </ChakraProgress.Label>
  )
})

export const ProgressRoot = ChakraProgress.Root
export const ProgressValueText = ChakraProgress.ValueText
