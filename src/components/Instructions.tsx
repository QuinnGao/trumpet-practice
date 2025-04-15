import { CardDescription } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

export function Instructions() {
  const { t } = useTranslation()

  return (
    <CardDescription className="space-y-2 text-start">
      {t("app.description")}
      <br />- {t("app.instructions.start")}
      <br />- {t("app.instructions.target")}
      <br />- {t("app.instructions.play")}
      <br />- {t("app.instructions.feedback")}
      <br />- {t("app.instructions.autoNext")}
      <br />- {t("app.instructions.continue")}
    </CardDescription>
  )
}
