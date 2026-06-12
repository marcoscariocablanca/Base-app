export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ foods: [], error: 'ANTHROPIC_API_KEY not set' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { imageBase64 } = await req.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
          },
          {
            type: 'text',
            text: 'Analiza esta foto de comida. Identifica cada alimento visible y estima sus valores nutricionales para la ración que se ve en la imagen. Responde ÚNICAMENTE con JSON válido, sin texto adicional: {"foods": [{"name": "nombre en español", "quantity_g": 150, "kcal": 250, "protein_g": 20.5, "carbs_g": 30.0, "fat_g": 5.2}]}',
          },
        ],
      }],
    }),
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ foods: [] }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await response.json()
  const text: string = data.content?.[0]?.text ?? '{}'

  try {
    const match = text.match(/\{[\s\S]*\}/)
    const json = match ? JSON.parse(match[0]) : { foods: [] }
    return new Response(JSON.stringify(json), { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return new Response(JSON.stringify({ foods: [] }), { headers: { 'Content-Type': 'application/json' } })
  }
}
