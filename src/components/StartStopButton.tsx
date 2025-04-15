import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface StartStopButtonProps {
  isListening: boolean
  onToggle: () => void
}

export function StartStopButton({
  isListening,
  onToggle,
}: StartStopButtonProps) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-center">
      <Button
        onClick={onToggle}
        variant={isListening ? "destructive" : "default"}
        size="lg"
      >
        {isListening ? t("app.ui.stop") : t("app.ui.start")}
      </Button>
    </div>
  )
}
