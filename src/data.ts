interface Note {
  note: string
  frequency: number
}

export const trumpetNotes: Note[] = [
  // 低音区
  { note: "F#3", frequency: 185.0 },
  { note: "G3", frequency: 196.0 },
  { note: "G#3", frequency: 207.65 },
  { note: "A3", frequency: 220.0 },
  { note: "A#3", frequency: 233.08 },
  { note: "B3", frequency: 246.94 },

  // 中音区
  { note: "C4", frequency: 261.63 },
  { note: "C#4", frequency: 277.18 },
  { note: "D4", frequency: 293.66 },
  { note: "D#4", frequency: 311.13 },
  { note: "E4", frequency: 329.63 },
  { note: "F4", frequency: 349.23 },
  { note: "F#4", frequency: 369.99 },
  { note: "G4", frequency: 392.0 },
  { note: "G#4", frequency: 415.3 },
  { note: "A4", frequency: 440.0 },
  { note: "A#4", frequency: 466.16 },
  { note: "B4", frequency: 493.88 },

  // 高音区
  { note: "C5", frequency: 523.25 },
  { note: "C#5", frequency: 554.37 },
  { note: "D5", frequency: 587.33 },
  { note: "D#5", frequency: 622.25 },
  { note: "E5", frequency: 659.25 },
  { note: "F5", frequency: 698.46 },
  { note: "F#5", frequency: 739.99 },
  { note: "G5", frequency: 783.99 },
  { note: "G#5", frequency: 830.61 },
  { note: "A5", frequency: 880.0 },
  { note: "A#5", frequency: 932.33 },
  { note: "B5", frequency: 987.77 },

  // 最高音区
  { note: "C6", frequency: 1046.5 },
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
