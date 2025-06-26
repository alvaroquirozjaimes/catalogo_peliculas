// Importa MongoClient para conectarte a MongoDB, ObjectId para manejar IDs y ServerApiVersion para configuración estable
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

// URI de conexión a MongoDB Atlas (debes reemplazar ??? con tu contraseña real)
const uri = 'mongodb+srv://user:???@cluster0.dhwmu.mongodb.net/?retryWrites=true&w=majority'

// Crea una instancia del cliente de MongoDB con configuración de la API estable
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Función que se conecta a la base de datos y devuelve la colección 'movies'
async function connect () {
  try {
    await client.connect() // Conexión al cluster de MongoDB
    const database = client.db('database') // Selecciona la base de datos llamada 'database'
    return database.collection('movies') // Devuelve la colección 'movies'
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close() // Si ocurre un error, cierra la conexión
  }
}

// Clase que maneja todas las operaciones sobre la colección 'movies'
export class MovieModel {

  // ✅ GET /movies?genre=...
  // Devuelve todas las películas o solo las que contienen el género buscado (filtro opcional)
  static async getAll ({ genre }) {
    const db = await connect()

    if (genre) {
      // Busca películas cuyo array "genre" contenga un valor similar (no sensible a mayúsculas)
      return db.find({
        genre: {
          $elemMatch: {
            $regex: genre,
            $options: 'i' // insensitive
          }
        }
      }).toArray()
    }

    // Si no se especifica un género, devuelve todas las películas
    return db.find({}).toArray()
  }

  // ✅ GET /movies/:id
  // Devuelve una película específica por su ID
  static async getById ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id) // Convierte el string ID a un ObjectId de MongoDB
    return db.findOne({ _id: objectId }) // Busca por _id
  }

  // ✅ POST /movies
  // Crea una nueva película con los datos recibidos (ya validados)
  static async create ({ input }) {
    const db = await connect()

    // Inserta un nuevo documento
    const { insertedId } = await db.insertOne(input)

    // Devuelve la nueva película con su ID generado
    return {
      id: insertedId,
      ...input
    }
  }

  // ✅ DELETE /movies/:id
  // Elimina una película por su ID
  static async delete ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0 // true si se eliminó, false si no
  }

  // ✅ PATCH /movies/:id
  // Actualiza parcialmente una película con los datos proporcionados
  static async update ({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    // Actualiza solo los campos recibidos (parcial)
    const { ok, value } = await db.findOneAndUpdate(
      { _id: objectId },       // Filtro por ID
      { $set: input },         // Campos a actualizar
      { returnNewDocument: true } // Devuelve el documento actualizado
    )

    // Si no se actualizó, retorna false
    if (!ok) return false

    // Devuelve el documento actualizado
    return value
  }
}
