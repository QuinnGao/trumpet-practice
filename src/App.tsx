import { useState, useEffect, useRef } from "react"
import { getClosestNote, trumpetNotes } from "./data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTranslation } from "react-i18next"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function App() {
  const { t, i18n } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [frequency, setFrequency] = useState(0)
  const [closestNote, setClosestNote] = useState<string | null>(null)
  const [targetNote, setTargetNote] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const isListeningRef = useRef(false)
  const feedbackTimeoutRef = useRef<number | null>(null)

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const getRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * trumpetNotes.length)
    return trumpetNotes[randomIndex].note
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 2048
      isListeningRef.current = true
      setIsListening(true)
      setTargetNote(getRandomNote())
      setFeedback(null)
      updateFrequency()
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopListening = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      tracks.forEach((track) => {
        track.enabled = false
        track.stop()
      })
      streamRef.current = null
      isListeningRef.current = false
      setIsListening(false)
    } else {
      isListeningRef.current = false
      setIsListening(false)
    }
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = null
    }
  }

  const updateFrequency = () => {
    if (!analyserRef.current || !isListeningRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Find the dominant frequency
    let maxValue = 0
    let maxIndex = 0
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i]
        maxIndex = i
      }
    }

    // Convert index to frequency
    const dominantFrequency =
      (maxIndex * audioContextRef.current!.sampleRate) /
      analyserRef.current.fftSize
    console.log("dominantFrequency", dominantFrequency)
    setFrequency(Math.round(dominantFrequency))

    // 更新最接近的音符
    const note = getClosestNote(dominantFrequency, 5)
    setClosestNote(note?.note || null)

    // 检查是否匹配目标音符
    if (note?.note === targetNote && !feedback) {
      setFeedback("正确！")
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }
      feedbackTimeoutRef.current = window.setTimeout(() => {
        setTargetNote(getRandomNote())
        setFeedback(null)
      }, 2000)
    }

    animationFrameRef.current = requestAnimationFrame(updateFrequency)
  }

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [])

  return (
    <div className="relative container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="fixed top-4 right-4 z-50">
        <Select onValueChange={changeLanguage} defaultValue="zh">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="text-center text-2xl">
              {t("app.title")}
            </CardTitle>
          </div>
          {!isListening && (
            <CardDescription className="space-y-2 text-start">
              {t("app.description")}
              <br />- {t("app.instructions.start")}
              <br />- {t("app.instructions.target")}
              <br />- {t("app.instructions.play")}
              <br />- {t("app.instructions.feedback")}
              <br />- {t("app.instructions.autoNext")}
              <br />- {t("app.instructions.continue")}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-center">
            <div className="text-4xl font-bold">{frequency} Hz</div>
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
            <Progress value={Math.min(100, frequency / 10)} className="h-2" />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
            >
              {isListening ? t("app.ui.stop") : t("app.ui.start")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
