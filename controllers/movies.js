// Importa las funciones de validación para películas usando Zod
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

// Define la clase MovieController que maneja todas las operaciones sobre las películas
export class MovieController {
  // Constructor que recibe el modelo (inyección de dependencias)
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  // ✅ GET /movies
  // Devuelve todas las películas, o solo las que coinciden con el género pasado por query string
  getAll = async (req, res) => {
    const { genre } = req.query // Extrae el género de la URL (ej: /movies?genre=Action)
    const movies = await this.movieModel.getAll({ genre }) // Llama al modelo para obtener las películas
    res.json(movies) // Devuelve las películas en formato JSON
  }

  // ✅ GET /movies/:id
  // Devuelve una sola película por su ID
  getById = async (req, res) => {
    const { id } = req.params // Extrae el ID de los parámetros de la URL
    const movie = await this.movieModel.getById({ id }) // Busca la película en el modelo
    if (movie) return res.json(movie) // Si se encuentra, se devuelve
    res.status(404).json({ message: 'Movie not found' }) // Si no, se responde con 404
  }

  // ✅ POST /movies
  // Crea una nueva película con los datos recibidos en el cuerpo de la petición
  create = async (req, res) => {
    // Valida todos los campos requeridos del cuerpo usando Zod
    const result = validateMovie(req.body)

    // Si la validación falla, responde con error 400 y detalles del error
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    // Si la validación pasa, se crea la nueva película usando los datos validados
    const newMovie = await this.movieModel.create({ input: result.data })

    // Se responde con 201 (Created) y los datos de la nueva película
    res.status(201).json(newMovie)
  }

  // ✅ DELETE /movies/:id
  // Elimina una película existente por su ID
  delete = async (req, res) => {
    const { id } = req.params // Extrae el ID de la película a eliminar

    const result = await this.movieModel.delete({ id }) // Llama al modelo para eliminarla

    // Si no se encontró la película, responde con 404
    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    // Si se elimina correctamente, responde con mensaje de éxito
    return res.json({ message: 'Movie deleted' })
  }

  // ✅ PATCH /movies/:id
  // Actualiza parcialmente una película con los datos recibidos
  update = async (req, res) => {
    // Valida parcialmente los campos enviados (todos son opcionales)
    const result = validatePartialMovie(req.body)

    // Si la validación falla, responde con error 400
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params // Extrae el ID de la película a actualizar

    // Llama al modelo para actualizar los datos
    const updatedMovie = await this.movieModel.update({ id, input: result.data })

    // Devuelve la película actualizada (o undefined si no se encontró)
    return res.json(updatedMovie)
  }
}
