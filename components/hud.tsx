"use client"

import { useState } from "react"

interface ArtObject {
  id: string
  position: [number, number, number]
  title: string
  color: string
}

interface HUDProps {
  artObjects: ArtObject[]
  onTeleport: (position: [number, number, number]) => void
}

export function HUD({ artObjects, onTeleport }: HUDProps) {
  const [showTeleportMenu, setShowTeleportMenu] = useState(false)

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top left - Museum title */}
      <div className="absolute top-6 left-6 pointer-events-auto">
        <div className="text-cyan-400 font-mono text-sm opacity-70 hover:opacity-100 transition">
          <p className="text-xs text-purple-300">// VIRTUAL GALLERY</p>
          <p className="text-lg font-bold text-cyan-300">3D_MUSEUM</p>
          <p className="text-xs text-cyan-400 animate-pulse">● ONLINE</p>
        </div>
      </div>

      {/* Bottom left - Controls */}
      <div className="absolute bottom-6 left-6 text-cyan-400 font-mono text-xs opacity-60 space-y-1 pointer-events-auto">
        <p className="text-purple-300">[NAVIGATION]</p>
        <p>W/Z: Forward | S: Back | A/Q: Left | D: Right</p>
        <p className="text-pink-300">MOUSE: Look | ESC: Unlock</p>
      </div>

      {/* Bottom center - Quick teleport menu */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <button
          onClick={() => setShowTeleportMenu(!showTeleportMenu)}
          className="px-4 py-2 bg-black border border-cyan-400 text-cyan-400 text-xs font-mono hover:bg-cyan-400/10 transition rounded mb-3 uppercase tracking-wider"
        >
          {showTeleportMenu ? "▼ Close" : "► Teleport"}
        </button>

        {showTeleportMenu && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-cyan-400 rounded p-3 space-y-2 w-max">
            {artObjects.map((obj) => (
              <button
                key={obj.id}
                onClick={() => {
                  onTeleport(obj.position)
                  setShowTeleportMenu(false)
                }}
                className="flex items-center gap-3 p-2 w-full hover:bg-cyan-400/10 rounded transition border border-transparent hover:border-cyan-400/50"
              >
                {/* Colored square with pattern */}
                <div
                  className="w-8 h-8 rounded border border-opacity-50 flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: `${obj.color}20`,
                    borderColor: obj.color,
                  }}
                >
                  {obj.id.charAt(0).toUpperCase()}
                </div>
                <span className="text-cyan-400 text-xs font-mono">{obj.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom right - Status */}
      <div className="absolute bottom-6 right-6 text-right text-cyan-400 font-mono text-xs opacity-60 space-y-1 pointer-events-auto">
        <p className="text-purple-300">[SYSTEM]</p>
        <p>FPS: 60</p>
        <p className="text-cyan-400">✓ READY</p>
      </div>

      {/* Center - Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 border-2 border-cyan-400 rounded-full opacity-30" />
        <div className="w-2 h-2 bg-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
