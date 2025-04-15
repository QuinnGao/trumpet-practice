import { useTranslation } from "react-i18next"

interface NoteDisplayProps {
  closestNote: string | null
  targetNote: string | null
  feedback: string | null
}

export function NoteDisplay({
  closestNote,
  targetNote,
  feedback,
}: NoteDisplayProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4 text-center">
      <div className="text-muted-foreground min-h-[2.5rem] text-2xl">
        {closestNote
          ? `${t("app.ui.currentNote")}: ${closestNote}`
          : t("app.ui.noNoteDetected")}
      </div>
      <div className="text-primary text-3xl font-bold">
        {targetNote ? `${t("app.ui.targetNote")}: ${targetNote}` : ""}
      </div>
      {feedback && (
        <div className="text-2xl font-bold text-green-500">
          {t("app.ui.correct")}
        </div>
      )}
    </div>
  )
}
