// Importa Zod para definir y validar esquemas de datos
import z from 'zod'

// Define el esquema que debe cumplir una película válida
const movieSchema = z.object({
  // Campo obligatorio: título (string)
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required.'
  }),

  // Campo obligatorio: año (número entero entre 1900 y 2024)
  year: z.number().int().min(1900).max(2024),

  // Campo obligatorio: director (string)
  director: z.string(),

  // Campo obligatorio: duración en minutos (número entero positivo)
  duration: z.number().int().positive(),

  // Campo opcional: puntuación de 0 a 10, por defecto 5
  rate: z.number().min(0).max(10).default(5),

  // Campo obligatorio: URL del póster (validado como URL válida)
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),

  // Campo obligatorio: array de géneros válidos (enums)
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Crime',
      'Comedy',
      'Drama',
      'Fantasy',
      'Horror',
      'Thriller',
      'Sci-Fi'
    ]),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
})

// ✅ Función que valida una película completa (para POST)
// Devuelve { success: true, data } si es válido, o { success: false, error } si no
export function validateMovie (input) {
  return movieSchema.safeParse(input)
}

// ✅ Función que valida una película parcial (para PATCH)
// Todos los campos son opcionales (ideal para actualización parcial)
export function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}
