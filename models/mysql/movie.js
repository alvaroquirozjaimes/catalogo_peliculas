// Importa el cliente de MySQL que usa Promesas
import mysql from 'mysql2/promise'

// Configuración por defecto para conectarse a MySQL
const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',        // Cambiar si tu MySQL tiene contraseña
  database: 'moviesdb' // Nombre de la base de datos
}

// Usa la variable de entorno o la configuración por defecto
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

// Crea la conexión a la base de datos
const connection = await mysql.createConnection(connectionString)

// Clase que representa el modelo de Películas
export class MovieModel {
  // Obtener todas las películas, o filtrarlas por género si se especifica
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // Buscar el ID del género en la tabla "genre"
      const [genres] = await connection.query(
        'SELECT id FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      // Si no se encuentra el género, devolver array vacío
      if (genres.length === 0) return []

      const [{ id: genreId }] = genres

      // Obtener todas las películas relacionadas con ese género usando JOIN
      const [movies] = await connection.query(
        `SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, BIN_TO_UUID(m.id) id
         FROM movie m
         JOIN movie_genres mg ON m.id = mg.movie_id
         WHERE mg.genre_id = ?;`,
        [genreId]
      )

      return movies
    }

    // Si no hay filtro, obtener todas las películas
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
    )

    return movies
  }

  // Obtener una película por su ID
  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
       FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (movies.length === 0) return null // No encontrada
    return movies[0]
  }

  // Crear una nueva película en la base de datos
  static async create({ input }) {
    const {
      genre: genreInput, // array de strings, ej: ['Action', 'Drama']
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // Generar un UUID desde la base de datos
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      // Insertar la película
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
         VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )

      // Relacionar la película con los géneros en movie_genres
      for (const genreName of genreInput) {
        const [genres] = await connection.query(
          'SELECT id FROM genre WHERE name = ?',
          [genreName]
        )

        if (genres.length === 0) continue // Si no existe, lo ignora

        const [{ id: genreId }] = genres

        await connection.query(
          `INSERT INTO movie_genres (movie_id, genre_id)
           VALUES (UUID_TO_BIN(?), ?);`,
          [uuid, genreId]
        )
      }
    } catch (e) {
      throw new Error('Error creating movie') // Error genérico
    }

    // Devuelve la película creada
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
       FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]
  }

  // Eliminar una película por ID
  static async delete({ id }) {
    try {
      // Elimina relaciones de géneros primero
      await connection.query(
        'DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);',
        [id]
      )

      // Luego elimina la película
      const [result] = await connection.query(
        'DELETE FROM movie WHERE id = UUID_TO_BIN(?);',
        [id]
      )

      return result.affectedRows > 0 // true si se eliminó
    } catch (e) {
      throw new Error('Error deleting movie')
    }
  }

  // Actualizar parcialmente una película
  static async update({ id, input }) {
    const fields = []
    const values = []

    for (const key in input) {
      if (key === 'genre') continue // No actualizar géneros desde aquí
      fields.push(`${key} = ?`)
      values.push(input[key])
    }

    if (fields.length === 0) return null

    try {
      // Actualiza solo los campos enviados
      await connection.query(
        `UPDATE movie SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?);`,
        [...values, id]
      )

      // Devuelve la película actualizada
      const [movies] = await connection.query(
        `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
         FROM movie WHERE id = UUID_TO_BIN(?);`,
        [id]
      )

      return movies[0]
    } catch (e) {
      throw new Error('Error updating movie')
    }
  }
}