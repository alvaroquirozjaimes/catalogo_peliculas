/* // Importa la librería 'cors' para manejar peticiones entre dominios (Cross-Origin Resource Sharing)
import cors from 'cors'

// Define una lista de orígenes (dominios) permitidos para hacer peticiones a tu API
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',  // Desarrollo local (Vite, por ejemplo)
  'http://localhost:1234',  // Otro posible puerto local (Parcel, por ejemplo)
  'https://movies.com',     // Dominio de producción
  'https://midu.dev'        // Otro dominio autorizado
]

// Exporta una función que genera el middleware de CORS
// Se puede pasar una lista personalizada de orígenes aceptados si se desea
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    // Función que valida el origen de cada petición
    origin: (origin, callback) => {
      // Si el origen está en la lista permitida, acepta la petición
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true)
      }

      // Si no hay origen (por ejemplo, con herramientas como Postman o curl), también se permite
      if (!origin) {
        return callback(null, true)
      }

      // Si el origen no está permitido, rechaza con un error de CORS
      return callback(new Error('Not allowed by CORS'))
    }
  })
 */

  import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'https://movies.com',
  'https://midu.dev'
]

const isDevelopment = process.env.NODE_ENV !== 'production'

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (isDevelopment) {
        // Permitir todos los orígenes en desarrollo
        return callback(null, true)
      }

      if (!origin || acceptedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  })
