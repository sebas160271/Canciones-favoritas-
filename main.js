/* main.js
   - Genera la galería desde un arreglo de canciones.
   - Controla el reproductor principal (cambiar video al hacer click).
   - Filtrado por género.
   - Comentarios explicativos en español.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Año en el footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Datos de ejemplo: reemplaza los videoId por tus canciones favoritas de YouTube
  // Cada objeto contiene: id (YouTube videoId), title, artist, genre, year (opcional)
  const videos = [
    { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', genre: 'pop', year: '2017' },
    { id: 'DyDfgMOUjCI', title: 'bad guy', artist: 'Billie Eilish', genre: 'pop', year: '2019' },
    { id: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'rock', year: '1975' },
    { id: '5NV6Rdv1a3I', title: 'Get Lucky', artist: 'Daft Punk', genre: 'electrónica', year: '2013' },
    { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', genre: 'urbano', year: '2017' },
    { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa', genre: 'pop', year: '2015' },
    { id: 'Zi_XLOBDo_Y', title: 'Billie Jean', artist: 'Michael Jackson', genre: 'pop', year: '1982' },
    { https://youtu.be/AzT7HIrKMZU?si=6j7KIXj47_gTaE_J }
  ];

  // Referencias DOM
  const grid = document.getElementById('videoGrid');
  const quickList = document.getElementById('quickList');
  const mainPlayer = document.getElementById('mainPlayer');
  const playerTitle = document.getElementById('playerTitle');
  const playerMeta = document.getElementById('playerMeta');

  // Renderiza la galería (thumbnails)
  function renderGrid(list){
    grid.innerHTML = ''; // limpiar
    list.forEach(video => {
      const card = document.createElement('article');
      card.className = 'video-card';
      card.setAttribute('data-genre', video.genre);
      card.setAttribute('data-id', video.id);

      // Miniatura (YouTube thumbnail URL)
      const thumb = document.createElement('img');
      thumb.className = 'video-thumb';
      thumb.alt = `${video.title} — ${video.artist}`;
      thumb.loading = 'lazy';
      thumb.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

      const meta = document.createElement('div');
      meta.className = 'video-meta';
      meta.innerHTML = `<div class="video-title">${video.title}</div>
                        <div class="video-sub">${video.artist} · ${video.year || ''}</div>`;

      // Al hacer click en la tarjeta: carga el video en el reproductor principal
      card.addEventListener('click', () => {
        loadVideo(video);
        highlightActiveCard(video.id);
      });

      card.appendChild(thumb);
      card.appendChild(meta);
      grid.appendChild(card);
    });
  }

  // Renderiza la lista lateral (playlist rápida)
  function renderQuickList(list){
    quickList.innerHTML = '';
    list.forEach(video => {
      const li = document.createElement('li');
      li.textContent = `${video.title} — ${video.artist}`;
      li.tabIndex = 0;
      li.addEventListener('click', () => {
        loadVideo(video);
        highlightActiveCard(video.id);
        // Para accesibilidad: desplazarse al reproductor
        document.getElementById('mainPlayer').scrollIntoView({ behavior: 'smooth' });
      });
      quickList.appendChild(li);
    });
  }

  // Cargar un video en el iframe principal
  function loadVideo(video){
    // Query string con autoplay=1 para iniciar reproducción
    mainPlayer.src = `https://www.youtube.com/embed/${video.id}?rel=0&autoplay=1`;
    playerTitle.textContent = `${video.artist} — ${video.title}`;
    playerMeta.textContent = `${video.genre} · ${video.year || ''}`;
  }

  // Resalta la tarjeta activa (opcional visual)
  function highlightActiveCard(id){
    document.querySelectorAll('.video-card').forEach(c => {
      c.style.boxShadow = (c.getAttribute('data-id') === id) ? '0 12px 32px rgba(124,58,237,0.18)' : '';
      c.style.borderColor = (c.getAttribute('data-id') === id) ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.03)';
    });
  }

  // Filtrado simple por género: muestra/oculta tarjetas
  function applyFilter(filter){
    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => {
      const genre = card.getAttribute('data-genre');
      if (filter === 'all' || genre === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Inicialización: renderizar todo
  renderGrid(videos);
  renderQuickList(videos);

  // Selección de botones de filtro
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      applyFilter(f);
    });
  });

  // Opcional: marcar la primera tarjeta como activa al inicio
  highlightActiveCard(videos[0].id);

  // Accesibilidad: permitir reproducir mediante teclado (enter) en las tarjetas de video
  grid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.closest('.video-card')) {
      const id = e.target.closest('.video-card').getAttribute('data-id');
      const v = videos.find(x => x.id === id);
      if (v) loadVideo(v);
    }
  });

});
