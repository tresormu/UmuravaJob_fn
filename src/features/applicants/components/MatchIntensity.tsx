interface MatchIntensityProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function MatchIntensity({ score, size = 160, strokeWidth = 12 }: MatchIntensityProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="absolute transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-secondary"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 1s ease-in-out" }}
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>
      
      {/* Center Content */}
      <div className="text-center z-10">
        <span className="text-4xl font-bold text-primary">{score}%</span>
        <p className="text-[10px] uppercase font-bold text-primary/40 tracking-widest leading-none">Excellent</p>
      </div>
    </div>
  );
}
