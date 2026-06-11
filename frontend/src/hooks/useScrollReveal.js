import { useEffect, useRef } from 'react'

export default function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: options.threshold || 0.15 }
    )

    const el = ref.current
    if (el) {
      const fadeElements = el.querySelectorAll('.fade-up')
      fadeElements.forEach((child) => observer.observe(child))
    }

    return () => observer.disconnect()
  }, [options.threshold])

  return ref
}
