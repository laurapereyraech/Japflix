document.addEventListener('DOMContentLoaded', () => {
    // URL de la API donde se encuentran los datos de las películas
    const urlPeliculas = 'https://japceibal.github.io/japflix_api/movies-data.json';
    // Elementos del DOM para el campo de búsqueda y el botón
    const inputBuscar = document.getElementById('inputBuscar');
    const btnBuscar = document.getElementById('btnBuscar');
    const listaPeliculas = document.getElementById('lista');

    // Array para almacenar las películas
    let peliculas = [];

    // Cargar datos de películas desde la API
    fetch(urlPeliculas)
      .then(response => {
        // Verificar si la respuesta es exitosa
        if (response.ok) {
          return response.json(); // Convertir a JSON
        } else {
          throw Error(response.statusText); // Lanzar error si no es exitosa
        }
      })
      .then(data => {
        peliculas = data; // Guardar los datos de películas
        console.log('Información de películas cargada:', data); // Mostrar en consola
      })
      .catch(error => {
        console.error('Error al cargar las películas:', error); // Manejar errores
      });

    // Función para mostrar las películas filtradas en la lista
    function mostrarPeliculas(peliculasAMostrar) {
        listaPeliculas.innerHTML = ''; // Limpiar la lista antes de mostrar resultados
        listaPeliculas.classList.add('mx-5'); // Añadir clase para estilos

        // Iterar sobre cada película para crear su representación en la lista
        peliculasAMostrar.forEach(pelicula => {
            const releaseDate = new Date(pelicula.release_date); // Obtener fecha de lanzamiento
            const offcanvasId = `offcanvasTop-${pelicula.id}`; // ID único para el offcanvas
            const buttonId = `buttonOffcanvas-${pelicula.id}`; // ID único para el botón

            // Crear un elemento de lista para cada película
            const li = document.createElement('li');
            li.innerHTML = `
                <button id="${buttonId}" class="list-group-item list-group-item-action bg-dark text-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#${offcanvasId}" aria-controls="${offcanvasId}">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1 fw-bold">${pelicula.title}</h5> <!-- Título de la película -->
                        <small>${generarEstrellas(pelicula.vote_average)}</small> <!-- Generar estrellas de rating -->
                    </div>
                    <p class="mb-1 fst-italic fw-lighter">${pelicula.tagline}</p> <!-- Tagline de la película -->
                </button>

                <!-- Offcanvas para mostrar detalles de la película -->
                <div class="offcanvas offcanvas-top bg-dark text-light" tabindex="-1" id="${offcanvasId}" aria-labelledby="offcanvasTopLabel-${pelicula.id}">
                    <div class="offcanvas-header">
                        <div class="col">
                            <h5 class="offcanvas-title fs-2" id="offcanvasTopLabel-${pelicula.id}">${pelicula.title}</h5> <!-- Título en el offcanvas -->
                            <small class="text-muted">${pelicula.genres.map(genero => genero.name).join(' - ')}</small> <!-- Géneros de la película -->
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button> <!-- Botón de cerrar -->
                    </div>

                    <div class="offcanvas-body"> <!-- Cuerpo del offcanvas -->
                        <p>${pelicula.overview}</p> <!-- Sinopsis de la película -->
                        <div class="row"></div> <!-- Espacio para futuras adiciones -->
                    </div>
                    <div class="text-center mb-3">
                        <div class="dropdown-center d-grid gap-2 col-6 mx-auto">
                            <!-- Botón para mostrar más detalles -->
                            <button class="btn dropdown-toggle text-light btn-outline-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                More
                            </button>
                            <!-- Lista de detalles en el dropdown con fondo negro y texto blanco -->
                            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-start p-3 col-6 mx-auto"> <!-- Cambiar a dropdown-menu-dark -->
                                <li class="dropdown-item-text d-flex justify-content-between">
                                    <span>Year: </span><span>${releaseDate.getFullYear()}</span> <!-- Año de estreno -->
                                </li>
                                <li class="dropdown-item-text d-flex justify-content-between">
                                    <span>Runtime: </span><span>${pelicula.runtime} mins</span> <!-- Duración -->
                                </li>
                                <li class="dropdown-item-text d-flex justify-content-between">
                                    <span>Budget: </span><span>$${pelicula.budget.toLocaleString()}</span> <!-- Presupuesto -->
                                </li>
                                <li class="dropdown-item-text d-flex justify-content-between">
                                    <span>Revenue: </span><span>$${pelicula.revenue.toLocaleString()}</span> <!-- Ingresos -->
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>`;
    
            listaPeliculas.appendChild(li); // Añadir el elemento a la lista
        });
    }

    // Función para generar estrellas según el rating de la película
    function generarEstrellas(voteAverage) {
        const estrellas = Math.round(voteAverage / 2); // Convertir a estrellas de 5
        let estrellasHTML = '';
        for (let i = 0; i < 5; i++) {
            // Agregar estrellas llenas y vacías
            if (i < estrellas) {
                estrellasHTML += '<i class="fa fa-star text-warning"></i>';
            } else {
                estrellasHTML += '<i class="fa fa-star-o text-warning"></i>';
            }
        }
        return estrellasHTML; // Retornar el HTML de estrellas
    }

    // Función para filtrar películas según el término de búsqueda
    function filtrarPeliculas() {
        const busqueda = inputBuscar.value.toLowerCase(); // Obtener búsqueda en minúsculas

        return peliculas.filter(pelicula => 
            pelicula.title.toLowerCase().includes(busqueda) || // Coincide con título
            pelicula.tagline.toLowerCase().includes(busqueda) || // Coincide con tagline
            pelicula.genres.join(', ').toLowerCase().includes(busqueda) || // Coincide con géneros
            pelicula.overview.toLowerCase().includes(busqueda) // Coincide con sinopsis
        );
    }

    // Evento al hacer clic en el botón de búsqueda
    btnBuscar.addEventListener('click', function() {
        // Comprobar si hay texto en el campo de búsqueda
        if (inputBuscar.value.trim() !== '') {
            const peliculasFiltradas = filtrarPeliculas(); // Filtrar películas
            mostrarPeliculas(peliculasFiltradas); // Mostrar películas filtradas
        } else {
            listaPeliculas.innerHTML = ''; // Limpiar la lista si no hay búsqueda
        }
    });
});
