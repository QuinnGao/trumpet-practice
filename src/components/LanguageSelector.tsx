import { useTranslation } from "react-i18next"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageSelector({ className }: { className: string }) {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <Select onValueChange={changeLanguage} defaultValue="zh">
      <SelectTrigger className={className}>
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="zh">中文</SelectItem>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
      </SelectContent>
    </Select>
  )
}
