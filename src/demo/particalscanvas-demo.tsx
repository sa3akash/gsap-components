import { ParticleCanvas } from "@/components/ui/particle-canvas-1";

export default function DemoOne() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <ParticleCanvas/>
      <span className="pointer-events-none z-10 text-center text-7xl leading-none font-semibold tracking-tighter whitespace-pre-wrap">
       Particle Canvas
      </span>
    </div>
  )
}
