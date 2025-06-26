// Importa Router desde Express para crear rutas
import { Router } from 'express'

// Importa el controlador que maneja la lógica de negocio
import { MovieController } from '../controllers/movies.js'

// Esta función crea y devuelve un router con todas las rutas relacionadas a películas
export const createMovieRouter = ({ movieModel }) => {
  // Crea una nueva instancia del router
  const moviesRouter = Router()

  // Crea una instancia del controlador, inyectando el modelo (acceso a base de datos)
  const movieController = new MovieController({ movieModel })

  // Ruta GET /movies → obtiene todas las películas (o filtra por ?genre=)
  moviesRouter.get('/', movieController.getAll)

  // Ruta POST /movies → crea una nueva película
  moviesRouter.post('/', movieController.create)

  // Ruta GET /movies/:id → obtiene una película por su ID
  moviesRouter.get('/:id', movieController.getById)

  // Ruta DELETE /movies/:id → elimina una película por su ID
  moviesRouter.delete('/:id', movieController.delete)

  // Ruta PATCH /movies/:id → actualiza parcialmente una película
  moviesRouter.patch('/:id', movieController.update)

  // Retorna el router configurado
  return moviesRouter
}
