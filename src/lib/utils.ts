import { format, differenceInDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const today = () => format(new Date(), 'yyyy-MM-dd')

export const formatDate = (date: string) =>
  format(parseISO(date), "d 'de' MMMM", { locale: es })

export const daysSinceStart = (startDate: string): number =>
  differenceInDays(new Date(), parseISO(startDate)) + 1

const MOTIVATION_PHRASES = [
  'El compromiso siempre es visible.',
  'Hoy seguimos acumulando evidencias.',
  'Cada acción cuenta.',
  'Estás construyendo confianza.',
  'Un paso más cerca.',
  'Seguimos.',
  'Este es el camino.',
  'Lo importante no es la perfección. Es la continuidad.',
  'Incrementando la capacidad de sostener.',
  'Sigue plantando semillas. Un día te despertarás en el bosque que siempre soñaste.',
  'Lo que se construye despacio, dura.',
  'No se trata de ser perfecto. Se trata de seguir.',
  'Cada día que registras es una evidencia de quién estás eligiendo ser.',
  'El proceso no miente.',
  'La constancia hace lo que el talento promete.',
]

export const getDailyPhrase = (): string => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return MOTIVATION_PHRASES[dayOfYear % MOTIVATION_PHRASES.length]
}

type WelcomeStage = {
  greetings: ((name: string, day: number) => string)[]
  subtitles: string[]
}

const WELCOME_STAGES: { maxDay: number; stage: WelcomeStage }[] = [
  {
    maxDay: 5,
    stage: {
      greetings: [
        (n) => `Buenos días, ${n}.`,
        (n) => `Bienvenido, ${n}.`,
        (n) => `Hoy seguimos construyendo, ${n}.`,
        (n) => `Aquí estás, ${n}.`,
        (n) => `Empieza el día, ${n}.`,
      ],
      subtitles: [
        'Primeros pasos. Lo importante es empezar.',
        'Cada acción cuenta.',
        'Estás en el lugar correcto.',
        'El primer paso siempre es el más difícil.',
        'Hoy es un buen día para construir.',
      ],
    },
  },
  {
    maxDay: 14,
    stage: {
      greetings: [
        (n) => `Bienvenido de nuevo, ${n}.`,
        (n) => `Aquí sigues, ${n}.`,
        (n) => `Seguimos, ${n}.`,
        (n, d) => `Día ${d}, ${n}.`,
        (n) => `De vuelta, ${n}.`,
      ],
      subtitles: [
        'Ya estás cogiendo carrerilla.',
        'Gracias por volver.',
        'Estás construyendo algo importante.',
        'El compromiso siempre es visible.',
        'Incrementando la capacidad de sostener.',
        'Seguimos.',
      ],
    },
  },
  {
    maxDay: 21,
    stage: {
      greetings: [
        (_, d) => `Día ${d}.`,
        (n, d) => `Día ${d}, ${n}.`,
        (n) => `Aquí sigues, ${n}.`,
        (_, d) => `Día ${d}. Seguimos.`,
      ],
      subtitles: [
        'Ya has recorrido más camino del que crees.',
        'Seguimos ascendiendo.',
        'Estás acumulando evidencias.',
        'Un paso más cerca.',
        'Lo que se construye despacio, dura.',
        'Sigue plantando semillas.',
      ],
    },
  },
  {
    maxDay: 29,
    stage: {
      greetings: [
        (_, d) => `Día ${d}.`,
        (n, d) => `Día ${d}, ${n}.`,
        (_, d) => `Día ${d}. Casi.`,
      ],
      subtitles: [
        'Ya queda menos para completar tu primer mes.',
        'Seguimos construyendo.',
        'Cada día cuenta.',
        'El proceso no miente.',
        'Sigue plantando semillas. Un día te despertarás en el bosque que siempre soñaste.',
        'Tu primer mes se acerca.',
      ],
    },
  },
  {
    maxDay: 30,
    stage: {
      greetings: [
        (_, d) => `Día ${d}.`,
        (n, d) => `Día ${d}, ${n}.`,
        (n) => `Ya casi, ${n}.`,
      ],
      subtitles: [
        'Ya solo quedan unos días para completar tu primer mes.',
        'Lo que estás construyendo merece la pena.',
        'El compromiso siempre es visible.',
        'La constancia hace lo que el talento promete.',
        'Seguimos ascendiendo.',
      ],
    },
  },
]

const MILESTONE_30: WelcomeStage = {
  greetings: [
    () => 'Primer mes completado.',
    (n) => `Un mes, ${n}.`,
    () => 'Enhorabuena.',
  ],
  subtitles: [
    'Hace 30 días solo había intención. Hoy hay evidencias.',
    'Gracias por seguir construyendo.',
    'Esto es solo el principio.',
    'Lo que empezó como intención ya es evidencia.',
  ],
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

export const getWelcomeMessage = (
  name: string,
  dayNumber: number
): { greeting: string; subtitle: string; milestone: boolean } => {
  const firstName = name.split(' ')[0]
  const seed = dayNumber

  if (dayNumber >= 30) {
    return {
      greeting: pick(MILESTONE_30.greetings, seed)(firstName, dayNumber),
      subtitle: pick(MILESTONE_30.subtitles, seed + 1),
      milestone: dayNumber === 30,
    }
  }

  const { stage } = WELCOME_STAGES.find((s) => dayNumber <= s.maxDay)!
  return {
    greeting: pick(stage.greetings, seed)(firstName, dayNumber),
    subtitle: pick(stage.subtitles, seed + 1),
    milestone: false,
  }
}

const CHECK_PHRASES = [
  'Increíble. Otra evidencia más.',
  'Este es el camino.',
  'Cada acción cuenta.',
  'Estás construyendo confianza.',
  'El compromiso siempre es visible.',
  'Un paso más cerca.',
]

export const getCheckPhrase = (): string =>
  CHECK_PHRASES[Math.floor(Math.random() * CHECK_PHRASES.length)]

export const MOOD_MAP = {
  bien:     { emoji: '😊', label: 'Bien' },
  neutro:   { emoji: '😐', label: 'Neutro' },
  bajo:     { emoji: '😔', label: 'Bajo' },
  estres:   { emoji: '😤', label: 'Estrés' },
  ansiedad: { emoji: '😰', label: 'Ansiedad' },
} as const

export const MEAL_LABELS: Record<string, string> = {
  desayuno:    'Desayuno',
  media_manana: 'Media mañana',
  comida:      'Comida',
  merienda:    'Merienda',
  cena:        'Cena',
}

export const MEAL_ORDER = ['desayuno', 'media_manana', 'comida', 'merienda', 'cena']

export const MEALS_BY_COUNT: Record<number, string[]> = {
  3: ['desayuno', 'comida', 'cena'],
  4: ['desayuno', 'comida', 'merienda', 'cena'],
  5: ['desayuno', 'media_manana', 'comida', 'merienda', 'cena'],
}

export const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ')
