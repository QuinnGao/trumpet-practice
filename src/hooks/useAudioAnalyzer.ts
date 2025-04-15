import { useState, useRef, useEffect } from "react"
import { getClosestNote, getNotesByDifficulty, trumpetNotes } from "../data"
import { Difficulty } from "../interfaces"

export function useAudioAnalyzer(difficulty: Difficulty = Difficulty.EASY) {
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
  const difficultyRef = useRef<Difficulty>(difficulty)

  // Update difficulty ref when difficulty prop changes
  useEffect(() => {
    difficultyRef.current = difficulty
  }, [difficulty])

  const getRandomNote = () => {
    const notesForDifficulty = getNotesByDifficulty(difficultyRef.current)
    const randomIndex = Math.floor(Math.random() * notesForDifficulty.length)
    return notesForDifficulty[randomIndex].note
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

  return {
    isListening,
    frequency,
    closestNote,
    targetNote,
    feedback,
    startListening,
    stopListening,
  }
}
