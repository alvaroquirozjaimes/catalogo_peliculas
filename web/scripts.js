   const main = document.querySelector('main')
    const searchInput = document.getElementById('search')
    let allMovies = []

    const renderMovies = (movies) => {
      if (movies.length === 0) {
        main.innerHTML = '<p id="loading">No se encontraron películas.</p>'
        return
      }

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

      main.innerHTML = html
    }

    fetch('http://localhost:1234/movies')
      .then(res => res.json())
      .then(movies => {
        allMovies = movies
        renderMovies(movies)
      })
      .catch(err => {
        console.error('Error al cargar películas:', err)
        main.innerHTML = '<p id="loading">Error al cargar películas.</p>'
      })

    document.addEventListener('input', (e) => {
      if (e.target.id === 'search') {
        const query = e.target.value.toLowerCase()
        const filtered = allMovies.filter(movie =>
          movie.title.toLowerCase().includes(query)
        )
        renderMovies(filtered)
      }
    })

    document.addEventListener('click', e => {
      if (e.target.matches('button')) {
        const article = e.target.closest('article')
        const id = article.dataset.id

        fetch(`http://localhost:1234/movies/${id}`, {
          method: 'DELETE'
        })
          .then(res => {
            if (res.ok) {
              article.remove()
              allMovies = allMovies.filter(m => m.id !== id)
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

    // Agregar película desde formulario
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('movie-form')
      form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(form)

        const newMovie = {
          title: formData.get('title'),
          year: Number(formData.get('year')),
          director: formData.get('director'),
          duration: Number(formData.get('duration')),
          poster: formData.get('poster'),
          rate: Number(formData.get('rate')),
          genre: formData.get('genre').split(',').map(g => g.trim())
        }

        try {
          const res = await fetch('http://localhost:1234/movies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMovie)
          })

          if (!res.ok) throw new Error('Error al guardar película')

          const savedMovie = await res.json()
          allMovies.push(savedMovie)
          renderMovies(allMovies)
          form.reset()
          alert('Película agregada exitosamente ✅')
        } catch (err) {
          console.error(err)
          alert('No se pudo agregar la película ❌')
        }
      })
    })
