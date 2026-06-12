// Spanish food database based on BEDCA (Base de Datos Española de Composición de Alimentos)
// All nutritional values are per 100g

export interface SpanishFood {
  id: string
  name: string
  category: string
  kcal: number
  protein: number
  carbs: number
  fat: number
  portion: number       // default portion in grams
  portionLabel: string  // human-readable label
}

export const FOODS: SpanishFood[] = [
  // ── CEREALES ────────────────────────────────────────────
  { id: 'arroz-blanco-cocido',    name: 'Arroz blanco, cocido',      category: 'Cereales', kcal: 130, protein: 2.7,  carbs: 28.2, fat: 0.3,  portion: 200, portionLabel: '1 ración' },
  { id: 'arroz-integral-cocido',  name: 'Arroz integral, cocido',    category: 'Cereales', kcal: 111, protein: 2.6,  carbs: 23.0, fat: 0.9,  portion: 200, portionLabel: '1 ración' },
  { id: 'pasta-cocida',           name: 'Pasta, cocida',             category: 'Cereales', kcal: 158, protein: 5.8,  carbs: 30.6, fat: 1.0,  portion: 200, portionLabel: '1 ración' },
  { id: 'pasta-integral-cocida',  name: 'Pasta integral, cocida',    category: 'Cereales', kcal: 143, protein: 5.5,  carbs: 27.2, fat: 1.1,  portion: 200, portionLabel: '1 ración' },
  { id: 'avena-cruda',            name: 'Avena, copos',              category: 'Cereales', kcal: 366, protein: 13.0, carbs: 61.0, fat: 7.0,  portion: 80,  portionLabel: '1 ración' },
  { id: 'pan-blanco',             name: 'Pan blanco',                category: 'Cereales', kcal: 265, protein: 8.0,  carbs: 52.0, fat: 2.6,  portion: 50,  portionLabel: '1 rebanada' },
  { id: 'pan-integral',           name: 'Pan integral',              category: 'Cereales', kcal: 239, protein: 9.0,  carbs: 46.0, fat: 3.0,  portion: 50,  portionLabel: '1 rebanada' },
  { id: 'quinoa-cocida',          name: 'Quinoa, cocida',            category: 'Cereales', kcal: 120, protein: 4.4,  carbs: 21.3, fat: 1.9,  portion: 180, portionLabel: '1 ración' },
  { id: 'tortitas-arroz',         name: 'Tortitas de arroz',         category: 'Cereales', kcal: 387, protein: 7.0,  carbs: 82.0, fat: 3.0,  portion: 20,  portionLabel: '1 tortita' },
  { id: 'boniato-cocido',         name: 'Boniato, cocido',           category: 'Cereales', kcal: 90,  protein: 2.0,  carbs: 20.7, fat: 0.1,  portion: 200, portionLabel: '1 ración' },
  { id: 'patata-cocida',          name: 'Patata, cocida',            category: 'Cereales', kcal: 86,  protein: 1.8,  carbs: 19.7, fat: 0.1,  portion: 200, portionLabel: '1 ración' },

  // ── CARNES ──────────────────────────────────────────────
  { id: 'pechuga-pollo-plancha',  name: 'Pechuga de pollo, a la plancha', category: 'Carnes', kcal: 120, protein: 22.0, carbs: 0.0, fat: 3.0,  portion: 150, portionLabel: '1 filete' },
  { id: 'muslo-pollo',            name: 'Muslo de pollo, sin piel',       category: 'Carnes', kcal: 153, protein: 19.0, carbs: 0.0, fat: 8.5,  portion: 150, portionLabel: '1 muslo' },
  { id: 'pollo-entero',           name: 'Pollo, carne entera',            category: 'Carnes', kcal: 167, protein: 20.0, carbs: 0.0, fat: 9.7,  portion: 150, portionLabel: '1 ración' },
  { id: 'pavo-pechuga',           name: 'Pechuga de pavo',               category: 'Carnes', kcal: 107, protein: 21.0, carbs: 0.0, fat: 2.5,  portion: 150, portionLabel: '1 filete' },
  { id: 'ternera-solomillo',      name: 'Ternera, solomillo',            category: 'Carnes', kcal: 171, protein: 20.0, carbs: 0.0, fat: 10.0, portion: 150, portionLabel: '1 filete' },
  { id: 'ternera-filete',         name: 'Ternera, filete',               category: 'Carnes', kcal: 142, protein: 21.0, carbs: 0.0, fat: 6.0,  portion: 150, portionLabel: '1 filete' },
  { id: 'cerdo-lomo',             name: 'Cerdo, lomo',                   category: 'Carnes', kcal: 182, protein: 20.0, carbs: 0.0, fat: 11.0, portion: 150, portionLabel: '1 filete' },
  { id: 'jamon-serrano',          name: 'Jamón serrano',                 category: 'Carnes', kcal: 241, protein: 30.4, carbs: 0.5, fat: 13.0, portion: 40,  portionLabel: '2-3 lonchas' },
  { id: 'jamon-york',             name: 'Jamón de york',                 category: 'Carnes', kcal: 107, protein: 18.0, carbs: 0.8, fat: 3.0,  portion: 80,  portionLabel: '2-3 lonchas' },
  { id: 'salchicha-pavo',         name: 'Salchicha de pavo',             category: 'Carnes', kcal: 150, protein: 16.0, carbs: 2.0, fat: 8.5,  portion: 60,  portionLabel: '2 unidades' },

  // ── PESCADOS ─────────────────────────────────────────────
  { id: 'atun-natural',           name: 'Atún al natural (lata)',   category: 'Pescados', kcal: 108, protein: 23.5, carbs: 0.0, fat: 1.5,  portion: 80,  portionLabel: '1 lata' },
  { id: 'atun-aceite',            name: 'Atún en aceite (lata)',    category: 'Pescados', kcal: 225, protein: 22.0, carbs: 0.0, fat: 15.0, portion: 80,  portionLabel: '1 lata' },
  { id: 'salmon',                 name: 'Salmón',                   category: 'Pescados', kcal: 208, protein: 20.0, carbs: 0.0, fat: 13.5, portion: 150, portionLabel: '1 filete' },
  { id: 'merluza',                name: 'Merluza',                  category: 'Pescados', kcal: 79,  protein: 16.0, carbs: 0.0, fat: 1.5,  portion: 150, portionLabel: '1 filete' },
  { id: 'bacalao',                name: 'Bacalao',                  category: 'Pescados', kcal: 82,  protein: 18.0, carbs: 0.0, fat: 0.7,  portion: 150, portionLabel: '1 filete' },
  { id: 'sardinas-lata',          name: 'Sardinas (lata)',           category: 'Pescados', kcal: 191, protein: 19.0, carbs: 0.0, fat: 12.5, portion: 80,  portionLabel: '1 lata' },
  { id: 'dorada',                 name: 'Dorada',                   category: 'Pescados', kcal: 96,  protein: 18.5, carbs: 0.0, fat: 2.5,  portion: 150, portionLabel: '1 filete' },
  { id: 'gambas',                 name: 'Gambas',                   category: 'Pescados', kcal: 96,  protein: 19.0, carbs: 0.0, fat: 1.8,  portion: 150, portionLabel: '1 ración' },
  { id: 'mejillones',             name: 'Mejillones',               category: 'Pescados', kcal: 86,  protein: 11.9, carbs: 3.7, fat: 2.2,  portion: 150, portionLabel: '1 ración' },
  { id: 'lubina',                 name: 'Lubina',                   category: 'Pescados', kcal: 98,  protein: 18.0, carbs: 0.0, fat: 3.0,  portion: 150, portionLabel: '1 filete' },

  // ── HUEVOS ───────────────────────────────────────────────
  { id: 'huevo-entero',           name: 'Huevo entero',             category: 'Huevos', kcal: 149, protein: 12.5, carbs: 0.7, fat: 10.7, portion: 55,  portionLabel: '1 huevo' },
  { id: 'clara-huevo',            name: 'Clara de huevo',           category: 'Huevos', kcal: 47,  protein: 11.0, carbs: 0.7, fat: 0.2,  portion: 33,  portionLabel: '1 clara' },
  { id: 'tortilla-francesa',      name: 'Tortilla francesa (2 huevos)', category: 'Huevos', kcal: 185, protein: 12.0, carbs: 0.5, fat: 15.0, portion: 120, portionLabel: '1 tortilla' },

  // ── LÁCTEOS ──────────────────────────────────────────────
  { id: 'leche-entera',           name: 'Leche entera',             category: 'Lácteos', kcal: 65,  protein: 3.2,  carbs: 4.7, fat: 3.8,  portion: 200, portionLabel: '1 vaso' },
  { id: 'leche-semidesnatada',    name: 'Leche semidesnatada',      category: 'Lácteos', kcal: 47,  protein: 3.3,  carbs: 4.8, fat: 1.6,  portion: 200, portionLabel: '1 vaso' },
  { id: 'leche-desnatada',        name: 'Leche desnatada',          category: 'Lácteos', kcal: 35,  protein: 3.4,  carbs: 4.9, fat: 0.2,  portion: 200, portionLabel: '1 vaso' },
  { id: 'yogur-natural',          name: 'Yogur natural',            category: 'Lácteos', kcal: 61,  protein: 3.8,  carbs: 4.7, fat: 3.3,  portion: 125, portionLabel: '1 yogur' },
  { id: 'yogur-griego',           name: 'Yogur griego',             category: 'Lácteos', kcal: 97,  protein: 5.7,  carbs: 3.8, fat: 6.7,  portion: 150, portionLabel: '1 yogur' },
  { id: 'queso-fresco',           name: 'Queso fresco',             category: 'Lácteos', kcal: 98,  protein: 12.0, carbs: 2.5, fat: 4.7,  portion: 100, portionLabel: '1 ración' },
  { id: 'queso-manchego',         name: 'Queso manchego curado',    category: 'Lácteos', kcal: 420, protein: 30.0, carbs: 1.9, fat: 33.0, portion: 30,  portionLabel: '1 loncha' },
  { id: 'requeson',               name: 'Requesón',                 category: 'Lácteos', kcal: 130, protein: 14.0, carbs: 4.0, fat: 6.0,  portion: 100, portionLabel: '1 ración' },
  { id: 'queso-cottage',          name: 'Queso cottage',            category: 'Lácteos', kcal: 98,  protein: 11.0, carbs: 3.4, fat: 4.3,  portion: 100, portionLabel: '1 ración' },
  { id: 'leche-avena',            name: 'Bebida de avena',          category: 'Lácteos', kcal: 45,  protein: 1.0,  carbs: 6.5, fat: 1.5,  portion: 250, portionLabel: '1 vaso' },
  { id: 'leche-almendras',        name: 'Bebida de almendras',      category: 'Lácteos', kcal: 24,  protein: 0.4,  carbs: 3.5, fat: 1.1,  portion: 250, portionLabel: '1 vaso' },

  // ── LEGUMBRES ────────────────────────────────────────────
  { id: 'lentejas-cocidas',       name: 'Lentejas, cocidas',        category: 'Legumbres', kcal: 116, protein: 9.0,  carbs: 20.0, fat: 0.4, portion: 200, portionLabel: '1 ración' },
  { id: 'garbanzos-cocidos',      name: 'Garbanzos, cocidos',       category: 'Legumbres', kcal: 164, protein: 8.9,  carbs: 27.4, fat: 2.6, portion: 200, portionLabel: '1 ración' },
  { id: 'alubias-cocidas',        name: 'Alubias blancas, cocidas', category: 'Legumbres', kcal: 124, protein: 8.3,  carbs: 22.0, fat: 0.5, portion: 200, portionLabel: '1 ración' },
  { id: 'edamame',                name: 'Edamame',                  category: 'Legumbres', kcal: 122, protein: 11.0, carbs: 9.0,  fat: 5.0, portion: 150, portionLabel: '1 ración' },

  // ── VERDURAS ─────────────────────────────────────────────
  { id: 'lechuga',                name: 'Lechuga',                  category: 'Verduras', kcal: 13,  protein: 1.3, carbs: 1.0, fat: 0.2, portion: 100, portionLabel: '1 bol' },
  { id: 'tomate',                 name: 'Tomate',                   category: 'Verduras', kcal: 18,  protein: 0.9, carbs: 3.5, fat: 0.2, portion: 150, portionLabel: '1 tomate' },
  { id: 'pepino',                 name: 'Pepino',                   category: 'Verduras', kcal: 13,  protein: 0.7, carbs: 2.0, fat: 0.1, portion: 100, portionLabel: '1 ración' },
  { id: 'zanahoria',              name: 'Zanahoria',                category: 'Verduras', kcal: 35,  protein: 0.9, carbs: 7.9, fat: 0.2, portion: 100, portionLabel: '1 zanahoria' },
  { id: 'brocoli',                name: 'Brócoli',                  category: 'Verduras', kcal: 34,  protein: 2.8, carbs: 4.0, fat: 0.4, portion: 150, portionLabel: '1 ración' },
  { id: 'espinacas',              name: 'Espinacas',                category: 'Verduras', kcal: 23,  protein: 2.9, carbs: 1.4, fat: 0.4, portion: 100, portionLabel: '1 ración' },
  { id: 'pimiento-rojo',          name: 'Pimiento rojo',            category: 'Verduras', kcal: 31,  protein: 0.9, carbs: 7.2, fat: 0.2, portion: 100, portionLabel: '1 pimiento' },
  { id: 'cebolla',                name: 'Cebolla',                  category: 'Verduras', kcal: 40,  protein: 1.1, carbs: 9.0, fat: 0.1, portion: 80,  portionLabel: '1 cebolla' },
  { id: 'calabacin',              name: 'Calabacín',                category: 'Verduras', kcal: 17,  protein: 1.2, carbs: 2.6, fat: 0.3, portion: 150, portionLabel: '1 ración' },
  { id: 'berenjena',              name: 'Berenjena',                category: 'Verduras', kcal: 25,  protein: 0.9, carbs: 3.5, fat: 0.4, portion: 150, portionLabel: '1 ración' },
  { id: 'champinones',            name: 'Champiñones',              category: 'Verduras', kcal: 22,  protein: 3.1, carbs: 0.5, fat: 0.5, portion: 100, portionLabel: '1 ración' },
  { id: 'judias-verdes',          name: 'Judías verdes',            category: 'Verduras', kcal: 31,  protein: 1.8, carbs: 5.7, fat: 0.2, portion: 150, portionLabel: '1 ración' },
  { id: 'esparragos',             name: 'Espárragos',               category: 'Verduras', kcal: 25,  protein: 2.5, carbs: 2.0, fat: 0.3, portion: 150, portionLabel: '1 ración' },
  { id: 'coliflor',               name: 'Coliflor',                 category: 'Verduras', kcal: 27,  protein: 2.0, carbs: 4.1, fat: 0.2, portion: 150, portionLabel: '1 ración' },
  { id: 'acelgas',                name: 'Acelgas',                  category: 'Verduras', kcal: 19,  protein: 1.8, carbs: 2.4, fat: 0.2, portion: 100, portionLabel: '1 ración' },
  { id: 'puerro',                 name: 'Puerro',                   category: 'Verduras', kcal: 61,  protein: 1.5, carbs: 14.2, fat: 0.3, portion: 100, portionLabel: '1 puerro' },
  { id: 'col-repollo',            name: 'Repollo',                  category: 'Verduras', kcal: 27,  protein: 1.8, carbs: 4.3, fat: 0.2, portion: 100, portionLabel: '1 ración' },
  { id: 'aguacate',               name: 'Aguacate',                 category: 'Verduras', kcal: 160, protein: 2.0, carbs: 8.5, fat: 14.7, portion: 150, portionLabel: '1 aguacate' },

  // ── FRUTAS ───────────────────────────────────────────────
  { id: 'manzana',                name: 'Manzana',                  category: 'Frutas', kcal: 52,  protein: 0.3, carbs: 13.8, fat: 0.2, portion: 180, portionLabel: '1 pieza' },
  { id: 'naranja',                name: 'Naranja',                  category: 'Frutas', kcal: 47,  protein: 0.9, carbs: 11.2, fat: 0.1, portion: 180, portionLabel: '1 pieza' },
  { id: 'platano',                name: 'Plátano',                  category: 'Frutas', kcal: 89,  protein: 1.1, carbs: 22.8, fat: 0.3, portion: 120, portionLabel: '1 plátano' },
  { id: 'fresas',                 name: 'Fresas',                   category: 'Frutas', kcal: 32,  protein: 0.7, carbs: 7.7,  fat: 0.3, portion: 150, portionLabel: '1 ración' },
  { id: 'uvas',                   name: 'Uvas',                     category: 'Frutas', kcal: 69,  protein: 0.7, carbs: 18.1, fat: 0.2, portion: 150, portionLabel: '1 racimo' },
  { id: 'sandia',                 name: 'Sandía',                   category: 'Frutas', kcal: 30,  protein: 0.6, carbs: 7.6,  fat: 0.2, portion: 300, portionLabel: '1 raja' },
  { id: 'melon',                  name: 'Melón',                    category: 'Frutas', kcal: 34,  protein: 0.8, carbs: 8.2,  fat: 0.3, portion: 200, portionLabel: '1 raja' },
  { id: 'melocoton',              name: 'Melocotón',                category: 'Frutas', kcal: 39,  protein: 0.9, carbs: 9.5,  fat: 0.3, portion: 150, portionLabel: '1 pieza' },
  { id: 'pera',                   name: 'Pera',                     category: 'Frutas', kcal: 57,  protein: 0.4, carbs: 15.5, fat: 0.1, portion: 170, portionLabel: '1 pieza' },
  { id: 'kiwi',                   name: 'Kiwi',                     category: 'Frutas', kcal: 61,  protein: 1.1, carbs: 14.7, fat: 0.5, portion: 80,  portionLabel: '1 kiwi' },
  { id: 'mandarina',              name: 'Mandarina',                category: 'Frutas', kcal: 53,  protein: 0.8, carbs: 13.3, fat: 0.2, portion: 80,  portionLabel: '1 pieza' },
  { id: 'pina',                   name: 'Piña',                     category: 'Frutas', kcal: 50,  protein: 0.5, carbs: 13.1, fat: 0.1, portion: 150, portionLabel: '1 ración' },
  { id: 'mango',                  name: 'Mango',                    category: 'Frutas', kcal: 65,  protein: 0.5, carbs: 17.0, fat: 0.3, portion: 200, portionLabel: '1 mango' },

  // ── FRUTOS SECOS ─────────────────────────────────────────
  { id: 'almendras',              name: 'Almendras',                category: 'Frutos secos', kcal: 579, protein: 21.0, carbs: 21.7, fat: 49.9, portion: 30, portionLabel: '1 puñado' },
  { id: 'nueces',                 name: 'Nueces',                   category: 'Frutos secos', kcal: 654, protein: 15.2, carbs: 13.7, fat: 65.2, portion: 30, portionLabel: '1 puñado' },
  { id: 'anacardos',              name: 'Anacardos',                category: 'Frutos secos', kcal: 553, protein: 18.2, carbs: 30.2, fat: 43.8, portion: 30, portionLabel: '1 puñado' },
  { id: 'pistachos',              name: 'Pistachos',                category: 'Frutos secos', kcal: 560, protein: 20.2, carbs: 27.6, fat: 45.4, portion: 30, portionLabel: '1 puñado' },
  { id: 'cacahuetes',             name: 'Cacahuetes',               category: 'Frutos secos', kcal: 567, protein: 25.8, carbs: 16.1, fat: 49.2, portion: 30, portionLabel: '1 puñado' },
  { id: 'mantequilla-cacahuete',  name: 'Crema de cacahuete',       category: 'Frutos secos', kcal: 588, protein: 25.0, carbs: 20.0, fat: 50.0, portion: 15, portionLabel: '1 cucharada' },

  // ── GRASAS ───────────────────────────────────────────────
  { id: 'aceite-oliva',           name: 'Aceite de oliva virgen extra', category: 'Grasas', kcal: 884, protein: 0.0, carbs: 0.0, fat: 100.0, portion: 10, portionLabel: '1 cucharada' },
  { id: 'mantequilla',            name: 'Mantequilla',              category: 'Grasas', kcal: 717, protein: 0.9, carbs: 0.1, fat: 81.0,  portion: 10, portionLabel: '1 cucharadita' },

  // ── SUPLEMENTOS ──────────────────────────────────────────
  { id: 'proteina-whey',          name: 'Proteína whey (scoop)',    category: 'Suplementos', kcal: 370, protein: 75.0, carbs: 10.0, fat: 5.0, portion: 30, portionLabel: '1 scoop' },
  { id: 'proteina-vegana',        name: 'Proteína vegana (scoop)',  category: 'Suplementos', kcal: 350, protein: 70.0, carbs: 12.0, fat: 6.0, portion: 30, portionLabel: '1 scoop' },
]

// Normalize string: lowercase + remove accents
function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

export function searchSpanishFoods(query: string): SpanishFood[] {
  const q = norm(query)
  if (!q) return []

  const words = q.split(/\s+/).filter(Boolean)

  const scored = FOODS.map((food) => {
    const n = norm(food.name)
    let score = 0

    if (n === q) {
      score = 100
    } else if (n.startsWith(q)) {
      score = 80
    } else if (words.every((w) => n.includes(w))) {
      score = words.length > 1 ? 70 : 60
    } else if (words.some((w) => n.startsWith(w))) {
      score = 50
    } else if (words.some((w) => n.includes(w) && w.length >= 3)) {
      score = 30
    }

    return { food, score }
  })

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name, 'es'))
    .slice(0, 20)
    .map((x) => x.food)
}

export function getFoodById(id: string): SpanishFood | undefined {
  return FOODS.find((f) => f.id === id)
}
