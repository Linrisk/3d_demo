"use client"

interface InfoPopupProps {
  id: string
  title: string
  description: string
  color: string
}

export function InfoPopup({ id, title, description, color }: InfoPopupProps) {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
      <div
        className="p-6 rounded-lg border-2 shadow-2xl backdrop-blur-sm animate-fade-in"
        style={{
          borderColor: color,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          boxShadow: `0 0 30px ${color}80, inset 0 0 20px ${color}30`,
        }}
      >
        <div className="text-4xl mb-3 text-center">
          {id === "ricard" && "👨"}
          {id === "malta" && "🏝️"}
          {id === "3d" && "🎲"}
          {id === "maison" && "🏠"}
        </div>

        <h3 className="text-2xl font-bold mb-2" style={{ color }}>
          {title}
        </h3>
        <p className="text-sm font-mono max-w-xs" style={{ color: `${color}dd` }}>
          {description}
        </p>

        <div className="mt-4 text-xs opacity-60" style={{ color }}>
          Approchez-vous pour explorer →
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
