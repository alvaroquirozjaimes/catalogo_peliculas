// Selecciona el elemento <main> del HTML donde se mostrarán las películas
const main = document.querySelector('main')

// Selecciona el input de búsqueda
const searchInput = document.getElementById('search')

// Variable global para almacenar todas las películas obtenidas del backend
let allMovies = []

// Función para renderizar las películas en pantalla
const renderMovies = (movies) => {
  // Si no hay películas, muestra mensaje de "No se encontraron"
  if (movies.length === 0) {
    main.innerHTML = '<p id="loading">No se encontraron películas.</p>'
    return
  }

  // Mapea cada película a una estructura HTML y las une en una sola cadena
  const html = movies.map(movie => `
    <article data-id="${movie.id}">
      <img src="${movie.poster}" alt="${movie.title}" />
      <div class="info">
        <h2>${movie.title}</h2>
        <p><strong>Año:</strong> ${movie.year}</p>
        <p><strong>Director:</strong> ${movie.director}</p>
        <p><strong>Duración:</strong> ${movie.duration} min</p>
        <p><strong>Calificación:</strong> ⭐ ${movie.rate}</p>
        <button>Eliminar</button>
      </div>
    </article>
  `).join('')

  // Inserta el HTML generado dentro del <main>
  main.innerHTML = html
}

// Hace una solicitud al backend para obtener las películas
fetch('http://localhost:1234/movies')
  .then(res => res.json()) // Convierte la respuesta a JSON
  .then(movies => {
    allMovies = movies // Guarda todas las películas en la variable global
    renderMovies(movies) // Renderiza las películas en pantalla
  })
  .catch(err => {
    console.error('Error al cargar películas:', err)
    main.innerHTML = '<p id="loading">Error al cargar películas.</p>'
  })

// Escucha eventos de entrada (input) para filtrar películas al escribir en el buscador
document.addEventListener('input', (e) => {
  if (e.target.id === 'search') {
    const query = e.target.value.toLowerCase()
    const filtered = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(query) // Filtra por coincidencia en el título
    )
    renderMovies(filtered) // Vuelve a renderizar con las películas filtradas
  }
})

// Escucha clics en todo el documento para manejar eliminación de películas
document.addEventListener('click', e => {
  if (e.target.matches('button')) {
    const article = e.target.closest('article') // Encuentra el contenedor <article> más cercano
    const id = article.dataset.id // Obtiene el ID de la película

    // Envía solicitud DELETE al backend para eliminar la película
    fetch(`http://localhost:1234/movies/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          article.remove() // Elimina el elemento del DOM
          allMovies = allMovies.filter(m => m.id !== id) // Actualiza la lista global
        } else {
          alert('No se pudo eliminar la película.')
        }
      })
      .catch(err => {
        console.error('Error al eliminar:', err)
        alert('Ocurrió un error al eliminar la película.')
      })
  }
})

// Escucha cuando el documento está totalmente cargado para inicializar el formulario
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('movie-form') // Selecciona el formulario

  // Maneja el evento de envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault() // Previene el comportamiento por defecto del formulario

    const formData = new FormData(form) // Extrae los datos del formulario

    // Construye un objeto con los datos del formulario
    const newMovie = {
      title: formData.get('title'),
      year: Number(formData.get('year')),
      director: formData.get('director'),
      duration: Number(formData.get('duration')),
      poster: formData.get('poster'),
      rate: Number(formData.get('rate')),
      genre: formData.get('genre').split(',').map(g => g.trim()) // Separa los géneros por coma
    }

    try {
      // Envía la nueva película al backend usando POST
      const res = await fetch('http://localhost:1234/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
      })

      if (!res.ok) throw new Error('Error al guardar película')

      const savedMovie = await res.json() // Obtiene la película guardada desde el backend
      allMovies.push(savedMovie) // Agrega la nueva película al array global
      renderMovies(allMovies) // Vuelve a renderizar la lista
      form.reset() // Limpia el formulario
      alert('Película agregada exitosamente ✅')
    } catch (err) {
      console.error(err)
      alert('No se pudo agregar la película ❌')
    }
  })
})
