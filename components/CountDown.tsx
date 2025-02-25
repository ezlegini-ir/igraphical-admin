import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

interface Props {
  minute: number;
  progressBar?: boolean;
}

const CountdownTimer = ({ minute, progressBar }: Props) => {
  const totalTime = minute * 60 * 1000; // Total countdown time in milliseconds
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 16, 0)); // Update every 16ms for ~60 FPS
    }, 16);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Convert timeLeft to seconds for display
  const secondsLeft = Math.floor(timeLeft / 1000);
  const progress = (timeLeft / totalTime) * 100;

  return (
    <div className="flex flex-col justify-center items-center text-gray-500 text-xs font-medium">
      <span className="en-digits">{secondsLeft} Seconds</span>
      {progressBar && (
        <Progress value={progress} className="h-[3px] transition-none" />
      )}
    </div>
  );
};

export default CountdownTimer;
