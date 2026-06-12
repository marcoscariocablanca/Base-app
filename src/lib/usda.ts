const API_KEY = 'DEMO_KEY'
const BASE = 'https://api.nal.usda.gov/fdc/v1'

export interface USDAFood {
  fdcId: number
  description: string
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export async function searchFoods(query: string): Promise<USDAFood[]> {
  if (!query.trim()) return []
  try {
    const url = `${BASE}/foods/search?query=${encodeURIComponent(query)}&api_key=${API_KEY}&pageSize=25&dataType=Foundation,SR%20Legacy`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return (data.foods ?? []).map((f: any) => {
      const get = (id: number): number =>
        f.foodNutrients?.find((n: any) => n.nutrientId === id)?.value ?? 0
      return {
        fdcId: f.fdcId,
        description: f.description,
        kcal: Math.round(get(1008)),
        protein: parseFloat(get(1003).toFixed(1)),
        carbs: parseFloat(get(1005).toFixed(1)),
        fat: parseFloat(get(1004).toFixed(1)),
      }
    })
  } catch {
    return []
  }
}
