"use client"
import React, { useEffect, useRef } from "react"
import styles from "./animated-background.module.css"

export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let raf = 0

    function onMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2 // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      // reduce intensity
      targetX = nx * 0.6
      targetY = ny * 0.6
    }

    function animate() {
      // easing
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      const node = el as HTMLDivElement
      node.style.setProperty("--mx", String(currentX))
      node.style.setProperty("--my", String(currentY))
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMove)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div id="animated-bg-debug" ref={ref} className={styles.background} aria-hidden>
      <div className={styles.gradient} />
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />

      {/* subtle sparkle SVG layer */}
      <svg className={styles.sparks} viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden>
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <g fill="url(#g1)" opacity="0.45">
          <circle cx="10%" cy="20%" r="2" />
          <circle cx="80%" cy="15%" r="1.6" />
          <circle cx="60%" cy="70%" r="2.4" />
          <circle cx="30%" cy="50%" r="1.2" />
          <circle cx="85%" cy="60%" r="1.8" />
        </g>
      </svg>
    </div>
  )
}
