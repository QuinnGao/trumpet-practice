import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSelector } from "@/components/LanguageSelector"
import { NoteDisplay } from "@/components/NoteDisplay"
import { FrequencyDisplay } from "@/components/FrequencyDisplay"
import { StartStopButton } from "@/components/StartStopButton"
import { Instructions } from "@/components/Instructions"
import { DifficultySelector } from "@/components/DifficultySelector"
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer"
import { Difficulty } from "./interfaces"

function App() {
  const { t } = useTranslation()
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY)
  const {
    isListening,
    frequency,
    closestNote,
    targetNote,
    feedback,
    startListening,
    stopListening,
  } = useAudioAnalyzer(difficulty)

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="relative container mx-auto flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mb-6 flex w-full max-w-2xl items-center justify-between gap-2">
        <DifficultySelector
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
        <LanguageSelector className="w-[100px]" />
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="text-center text-2xl">
              {t("app.title")}
            </CardTitle>
          </div>
          {!isListening && <Instructions />}
        </CardHeader>
        <CardContent className="space-y-6">
          <FrequencyDisplay frequency={frequency} />
          <NoteDisplay
            closestNote={closestNote}
            targetNote={targetNote}
            feedback={feedback}
          />
          <StartStopButton
            isListening={isListening}
            onToggle={toggleListening}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
