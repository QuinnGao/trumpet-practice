import { Note, Difficulty } from "./interfaces"

export const trumpetNotes: Note[] = [
  // 低音区
  { note: "F#3", frequency: 185.0, difficulty: Difficulty.EASY },
  { note: "G3", frequency: 196.0, difficulty: Difficulty.EASY },
  { note: "G#3", frequency: 207.65, difficulty: Difficulty.EASY },
  { note: "A3", frequency: 220.0, difficulty: Difficulty.EASY },
  { note: "A#3", frequency: 233.08, difficulty: Difficulty.EASY },
  { note: "B3", frequency: 246.94, difficulty: Difficulty.EASY },

  // 中音区
  { note: "C4", frequency: 261.63, difficulty: Difficulty.EASY },
  { note: "C#4", frequency: 277.18, difficulty: Difficulty.MEDIUM },
  { note: "D4", frequency: 293.66, difficulty: Difficulty.MEDIUM },
  { note: "D#4", frequency: 311.13, difficulty: Difficulty.MEDIUM },
  { note: "E4", frequency: 329.63, difficulty: Difficulty.MEDIUM },
  { note: "F4", frequency: 349.23, difficulty: Difficulty.MEDIUM },
  { note: "F#4", frequency: 369.99, difficulty: Difficulty.MEDIUM },
  { note: "G4", frequency: 392.0, difficulty: Difficulty.MEDIUM },
  { note: "G#4", frequency: 415.3, difficulty: Difficulty.HARD },
  { note: "A4", frequency: 440.0, difficulty: Difficulty.HARD },
  { note: "A#4", frequency: 466.16, difficulty: Difficulty.HARD },
  { note: "B4", frequency: 493.88, difficulty: Difficulty.HARD },

  // 高音区
  { note: "C5", frequency: 523.25, difficulty: Difficulty.HARD },
  { note: "C#5", frequency: 554.37, difficulty: Difficulty.EXPERT },
  { note: "D5", frequency: 587.33, difficulty: Difficulty.EXPERT },
  { note: "D#5", frequency: 622.25, difficulty: Difficulty.EXPERT },
  { note: "E5", frequency: 659.25, difficulty: Difficulty.EXPERT },
  { note: "F5", frequency: 698.46, difficulty: Difficulty.EXPERT },
  { note: "F#5", frequency: 739.99, difficulty: Difficulty.EXPERT },
  { note: "G5", frequency: 783.99, difficulty: Difficulty.EXPERT },
  { note: "G#5", frequency: 830.61, difficulty: Difficulty.EXPERT },
  { note: "A5", frequency: 880.0, difficulty: Difficulty.EXPERT },
  { note: "A#5", frequency: 932.33, difficulty: Difficulty.EXPERT },
  { note: "B5", frequency: 987.77, difficulty: Difficulty.EXPERT },

  // 最高音区
  { note: "C6", frequency: 1046.5, difficulty: Difficulty.EXPERT },
]

// 获取最接近的音符
export function getClosestNote(
  frequency: number,
  tolerance: number = 5
): Note | null {
  const closestNote = trumpetNotes.reduce((prev, curr) => {
    return Math.abs(curr.frequency - frequency) <
      Math.abs(prev.frequency - frequency)
      ? curr
      : prev
  })

  // 如果最接近的音符与目标频率的差异超过容差范围，返回 null
  const frequencyDiff = Math.abs(closestNote.frequency - frequency)
  const percentDiff = (frequencyDiff / frequency) * 100

  return percentDiff <= tolerance ? closestNote : null
}

// 根据难度获取音符
export function getNotesByDifficulty(difficulty: Difficulty): Note[] {
  return trumpetNotes.filter((note) => note.difficulty === difficulty)
}
