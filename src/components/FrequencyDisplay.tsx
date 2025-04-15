import { Progress } from "@/components/ui/progress"

interface FrequencyDisplayProps {
  frequency: number
}

export function FrequencyDisplay({ frequency }: FrequencyDisplayProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="text-4xl font-bold">{frequency} Hz</div>
      <Progress value={Math.min(100, frequency / 10)} className="h-2" />
    </div>
  )
}
