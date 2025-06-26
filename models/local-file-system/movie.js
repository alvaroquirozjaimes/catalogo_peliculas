// Importa randomUUID para generar identificadores únicos para cada película
import { randomUUID } from 'node:crypto'

// Importa una función personalizada que lee un archivo JSON (simula una base de datos)
import { readJSON } from '../../utils.js'

// Lee el archivo JSON con las películas (esta será nuestra "base de datos en memoria")
const movies = readJSON('./movies.json')

// Clase que define las operaciones de acceso a datos (modelo)
export class MovieModel {
  
  // ✅ GET /movies?genre=...
  // Devuelve todas las películas, o solo las que coinciden con un género específico
  static async getAll ({ genre }) {
    if (genre) {
      // Filtra las películas cuyo array de géneros contenga el género buscado (sin importar mayúsculas)
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }

    // Si no se pasó un género, devuelve todas las películas
    return movies
  }

  // ✅ GET /movies/:id
  // Busca y devuelve una película por su ID
  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie // Puede devolver undefined si no la encuentra
  }

  // ✅ POST /movies
  // Crea una nueva película con los datos validados que llegan como `input`
  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(), // Genera un ID único automáticamente
      ...input          // Expande los datos enviados (título, año, director, etc.)
    }

    // Agrega la nueva película al array
    movies.push(newMovie)

    // Retorna la película creada
    return newMovie
  }

  // ✅ DELETE /movies/:id
  // Elimina una película existente por su ID
  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    // Si no se encuentra, retorna false
    if (movieIndex === -1) return false

    // Elimina la película del array
    movies.splice(movieIndex, 1)

    return true // Retorna true para indicar éxito
  }

  // ✅ PATCH /movies/:id
  // Actualiza parcialmente una película con nuevos datos
  static async update ({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    // Si no se encuentra, retorna false
    if (movieIndex === -1) return false

    // Fusiona los datos actuales con los nuevos usando spread operator
    movies[movieIndex] = {
      ...movies[movieIndex], // Datos anteriores
      ...input               // Datos nuevos que sobrescriben los anteriores
    }

    // Devuelve la película actualizada
    return movies[movieIndex]
  }
}
