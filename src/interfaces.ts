export const Difficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  EXPERT: "expert",
} as const

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]

export interface Note {
  note: string
  frequency: number
  difficulty: Difficulty
}
