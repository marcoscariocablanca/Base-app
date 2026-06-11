# BASE App — Guía de instalación

## 1. Instalar Node.js

Descarga e instala desde: https://nodejs.org (versión LTS)

Verifica la instalación:
```bash
node --version   # debe mostrar v18+
npm --version
```

---

## 2. Instalar dependencias

Desde la carpeta del proyecto:
```bash
cd "/Users/marcosgmi/Desktop/BASE APP"
npm install
```

---

## 3. Configurar Supabase

### 3.1 Crear proyecto
1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto (nombre: `base-app`)
3. Guarda la URL del proyecto y la `anon key`

### 3.2 Crear tablas
1. En el dashboard de Supabase → SQL Editor
2. Copia y ejecuta el contenido de `supabase/schema.sql`

### 3.3 Variables de entorno
Crea el archivo `.env` en la raíz del proyecto:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

---

## 4. Arrancar la app

```bash
npm run dev
```

Abre http://localhost:5173

---

## 5. Crear primer usuario mentor

1. Regístrate en la app con tu email y contraseña
2. En Supabase → Table Editor → profiles
3. Cambia el campo `role` de `client` a `mentor` para tu usuario
4. El panel mentor aparece en el menú de navegación

---

## 6. Crear usuario Oscar (cliente ejemplo)

1. Regístrate con el email de Oscar
2. En Supabase → SQL Editor, ejecuta:
```sql
UPDATE public.profiles
SET age = 31, height_cm = 180, weight_kg = 120, goal_weight_kg = 85, daily_kcal_goal = 2500,
    training_days = array['lunes','miercoles','viernes'], meals_per_day = 3
WHERE email = 'oscar@ejemplo.com';
```

---

## Estructura del proyecto

```
src/
├── pages/          — 8 pantallas principales
├── components/
│   ├── ui/         — Componentes base (Card, Button, Slider…)
│   └── layout/     — AppShell, BottomNav, PageHeader
├── store/          — Estado global (Zustand)
├── lib/            — Supabase client, utilidades
└── types/          — TypeScript types
supabase/
└── schema.sql      — SQL completo con RLS
```

## Build para producción

```bash
npm run build
```

Despliega la carpeta `dist/` en Vercel, Netlify o similar.
