import { useTranslation } from "react-i18next"
import { Difficulty } from "../interfaces"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DifficultySelectorProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
}

export function DifficultySelector({
  difficulty,
  onDifficultyChange,
}: DifficultySelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{t("difficulty.label")}:</span>
      <Select
        value={difficulty}
        onValueChange={(value) => onDifficultyChange(value as Difficulty)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={t("difficulty.select")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Difficulty.EASY}>
            {t("difficulty.easy")}
          </SelectItem>
          <SelectItem value={Difficulty.MEDIUM}>
            {t("difficulty.medium")}
          </SelectItem>
          <SelectItem value={Difficulty.HARD}>
            {t("difficulty.hard")}
          </SelectItem>
          <SelectItem value={Difficulty.EXPERT}>
            {t("difficulty.expert")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
