// Importa Express y su middleware para analizar JSON
import express, { json } from 'express'

// Importa el router de películas
import { createMovieRouter } from './routes/movies.js'

// Importa el middleware CORS personalizado
import { corsMiddleware } from './middlewares/cors.js'

// Carga variables de entorno desde .env si existe
import 'dotenv/config'

// ✅ Función que crea y configura la app de Express
export const createApp = ({ movieModel }) => {
  const app = express() // Crea una nueva instancia de la app

  app.use(json()) // Middleware para parsear JSON
  app.use(corsMiddleware()) // Middleware para controlar acceso por origen
  app.disable('x-powered-by') // Oculta la cabecera 'X-Powered-By'

  // Usa el router de películas en la ruta base '/movies'
  app.use('/movies', createMovieRouter({ movieModel }))

  const PORT = process.env.PORT ?? 1234 // Usa el puerto del entorno o 1234

  // Inicia el servidor
  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
