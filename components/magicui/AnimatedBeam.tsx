'use client'

import React, { forwardRef, useRef } from 'react'

import { AnimatedBeam } from 'components/magicui/animated-beam'
import { cn } from '~/lib/utils';
import { Grid2x2Check } from 'lucide-react';

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = 'Circle'

export default function AnimatedBeamMultipleOutput({
  className,
}: {
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)
  const beamConnections = [
    { from: div1Ref, to: div6Ref },
    { from: div2Ref, to: div6Ref },
    { from: div3Ref, to: div6Ref },
    { from: div4Ref, to: div6Ref },
    { from: div5Ref, to: div6Ref },
    { from: div6Ref, to: div7Ref },
  ]

  return (
    <div
      className={cn(
        'relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10',
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <Icons.user />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16">
            <Grid2x2Check color='black' />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}>
            <Icons.user />
          </Circle>
          <Circle ref={div2Ref}>
            <Icons.user />
          </Circle>
          <Circle ref={div3Ref}>
            <Icons.user />
          </Circle>
          <Circle ref={div4Ref}>
            <Icons.user />
          </Circle>
          <Circle ref={div5Ref}>
            <Icons.user />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      {beamConnections.map((connection, index) => (
        <AnimatedBeam
          key={index}
          containerRef={containerRef}
          fromRef={connection.from}
          toRef={connection.to}
          duration={3}
        />
      ))}   
    </div>
  )
}

const Icons = {
  user: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
}