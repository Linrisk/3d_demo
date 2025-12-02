"use client"

interface WelcomeModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export function WelcomeModal({ isOpen, onDismiss }: WelcomeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-md">
      <div className="relative max-w-2xl w-full mx-4 bg-black/80 border border-cyan-500/50 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />

        <div className="relative z-10 p-12">
          <h1 className="text-4xl font-light tracking-wider mb-2 text-cyan-400 text-center">MUSEUM</h1>
          <p className="text-center text-cyan-400/60 mb-8 text-xs tracking-widest">Enter the gallery</p>

          <div className="space-y-4">
            <div className="p-4 border border-cyan-500/30 rounded-sm bg-cyan-500/5">
              <p className="text-cyan-400 text-sm font-light">
                <span className="text-cyan-300">W/Z</span> Forward • <span className="text-cyan-300">S</span> Back •{" "}
                <span className="text-cyan-300">A/Q</span> Left • <span className="text-cyan-300">D</span> Right
              </p>
              <p className="text-cyan-400/60 text-xs mt-2">Mouse to look • ESC to unlock</p>
            </div>

            <p className="text-cyan-400/50 text-xs text-center">
              Glowing zones appear near artworks • Teleport using HUD menu
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="w-full mt-8 py-2 px-4 bg-black border border-cyan-400/50 text-cyan-400 font-light rounded-sm text-xs hover:border-cyan-400 hover:bg-cyan-400/5 transition-all duration-300 uppercase tracking-wider"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  )
}
