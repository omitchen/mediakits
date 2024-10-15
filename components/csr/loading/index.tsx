import React from "react";

export default function loading() {
  return (
    <div className="inline-block w-10 h-10">
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className={`float-left w-1/3 h-1/3 bg-blue-500 animate-cubeGridScaleDelay`}
          style={{
            animationDelay: `${0.1 * ((index % 3) + Math.floor(index / 3))}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes cubeGridScaleDelay {
          0%,
          70%,
          100% {
            transform: scale3D(1, 1, 1);
          }
          35% {
            transform: scale3D(0, 0, 1);
          }
        }
        .animate-cubeGridScaleDelay {
          animation: cubeGridScaleDelay 1.3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
