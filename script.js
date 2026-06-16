document.addEventListener("DOMContentLoaded", () => {
  const audioEngine = document.getElementById("audio-engine");
  const trackCover = document.getElementById("track-cover");
  const trackTitle = document.getElementById("track-title");
  const trackArtist = document.getElementById("track-artist");

  const progressBar = document.getElementById("progress-bar");
  const volumeBar = document.getElementById("volume-bar");
  const timeCurrent = document.getElementById("time-current");
  const timeTotal = document.getElementById("time-total");

  const btnShuffle = document.getElementById("btn-shuffle");
  const btnPrev = document.getElementById("btn-prev");
  const btnPlayPause = document.getElementById("btn-play-pause");
  const btnNext = document.getElementById("btn-next");
  const btnLoop = document.getElementById("btn-loop");
  const btnMute = document.getElementById("btn-mute");

  const dropdownTrigger = document.getElementById("dropdown-trigger");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const toggleCoverBtn = document.getElementById("toggleCoversBtn");
  const songSearch = document.getElementById("song-search");
  const playlistTracks = document.getElementById("playlist-tracks");

  const htmlElement = document.documentElement;

  const songs = [
    {
      id: "1",
      title: "Lost in the City",
      artist: "Neon Drive",
      src: "assets/music/lost-in-the-city.mp3",
      cover: "assets/covers/neon-drive.png",
      duration: "03:45",
    },
    {
      id: "3",
      title: "Retro Wave",
      artist: "Cyber Heart",
      src: "assets/music/retro-wave.mp3",
      cover: "assets/covers/cyber-heart.png",
      duration: "02:58"
    }
  ];

  let currentSongIndex = 0;
  let isPlaying = false;
  let isShuffle = false;
  let isLoop = false;
  let showCovers = true;
  let searchQuery = "";

  const savedTheme = localStorage.getItem("soundboard-theme");
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme == 'dark' || (!savedTheme && prefersDark)) {
    htmlElement.classList.add("dark-theme");
    themeToggleBtn.textContent = 'Theme: dark';
  }

  dropdownTrigger.addEventListener("click" ,() => {
    dropdownMenu.classList.toggle('show');
  });

  window.addEventListener('click', event => {
    if (!dropdownTrigger.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove('show');
    }
  });

  themeToggleBtn.addEventListener("click", () => {
    htmlElement.classList.toggle("dark-theme");
    if (htmlElement.classList.contains('dark-theme')) {
      themeToggleBtn.textContent = "Theme: dark";
      localStorage.setItem("soundboard-theme", 'dark');
    } else {
      themeToggleBtn.textContent = "Theme: light";
      localStorage.setItem("soundboard-theme", "light");
    }
  });


  function loadSong(index) {
    const song = songs[index];
    if (!song) return;

    audioEngine.src = song.src;

    trackTitle.textContent = song.title;
    trackArtist.textContent = song.artist;

    trackCover.src = song.cover;

    timeCurrent.textContent = "00:00";
    timeTotal.textContent = song.duration;
    progressBar.value = 0;

    document.querySelectorAll(".playlist-item").forEach(item => {
      item.classList.remove("active");
    })

    const activePlaylistItem = document.querySelector(`.playlist-item[data-id="${song.id}"]`);
    activePlaylistItem.classList.add("active");
  }

  function renderPlaylist() {
    playlistTracks.innerHTML = "";

    const filteredSongs = songs.filter(song => {
      const title = song.title.toLowerCase();
      const artist = song.artist.toLowerCase();
      return title.includes(searchQuery) || artist.includes(searchQuery);
    });

    filteredSongs.forEach((song) => {
      const originalIndex = songs.findIndex(s => s.id === song.id);

      const trackHTML = `
        <div class="playlist-item" data-id="${song.id}" data-index="${originalIndex}">
          ${showCovers ? `<img class="pl-cover" src="${song.cover}" alt="${song.title}">` : ""}
          <div class="pl-info">
            <div class="pl-title">${song.title}</div>
            <div class="pl-artist">${song.artist}</div>
          </div>
          <div class="pl-duration">${song.duration}</div>
        </div>
      `;

      playlistTracks.insertAdjacentHTML("beforeend", trackHTML);
    });

    const currentSong = songs[currentSongIndex];
    if (currentSong) {
      const activeItem = document.querySelector(`.playlist-item[data-id="${currentSong.id}"]`);
      if (activeItem) activeItem.classList.add("active");
    }
  }

  renderPlaylist();
  loadSong(currentSongIndex);
});