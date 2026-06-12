export type Role = 'client' | 'mentor'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: Role
  age?: number
  height_cm?: number
  weight_kg?: number
  goal_weight_kg?: number
  daily_kcal_goal: number
  training_days: string[]
  meals_per_day: number
  created_at: string
  start_date: string
}

export interface NonNegotiable {
  id: string
  user_id: string
  date: string
  rest_done: boolean
  movement_done: boolean
  nutrition_done: boolean
  created_at: string
}

export interface Meal {
  id: string
  user_id: string
  date: string
  meal_type: 'desayuno' | 'media_manana' | 'comida' | 'merienda' | 'cena'
  foods?: string
  kcal_estimated?: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
  hunger_before?: number
  satiety_after?: number
  mood?: 'bien' | 'neutro' | 'bajo' | 'estres' | 'ansiedad'
  photo_url?: string
  notes?: string
  created_at: string
}

export interface MealItem {
  id: string
  user_id: string
  date: string
  meal_type: string
  food_name: string
  food_id?: string
  quantity_g: number
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  source: 'usda' | 'manual' | 'photo'
  created_at: string
}

export interface Training {
  id: string
  user_id: string
  date: string
  completed: boolean
  energy_level?: number
  difficulty?: number
  notes?: string
  created_at: string
}

export interface Evidence {
  id: string
  user_id: string
  date: string
  evidence_1?: string
  evidence_2?: string
  evidence_3?: string
  created_at: string
}

export interface MentorFeedback {
  id: string
  mentor_id: string
  client_id: string
  message: string
  read: boolean
  created_at: string
}

export interface FavoriteFood {
  id: string
  user_id: string
  food_name: string
  food_id?: string
  kcal_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  default_quantity_g: number
  created_at: string
}

export interface DaySummary {
  date: string
  non_neg_score: number
  has_training: boolean
  training_completed: boolean
  meals_logged: number
  has_evidence: boolean
}
