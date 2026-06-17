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
  const resetPlayerBtn = document.getElementById("resetPlayerBtn");
  const songSearch = document.getElementById("song-search");
  const playlistTracks = document.getElementById("playlist-tracks");

  const htmlElement = document.documentElement;

  const songs = [
    {
      id: "1",
      title: "Classic Party",
      artist: "Lyrium-2025",
      src: "assets/music/song1.mp3",
      cover: "assets/covers/cover1.jpg",
      duration: "01:35",
    },
    {
      id: "3",
      title: "KI - Instrumental (Classic)",
      artist: "Black_Rose_Rabbit",
      src: "assets/music/song2.mp3",
      cover: "assets/covers/cover2.jpg",
      duration: "02:34"
    },
    {
      id: "7",
      title: "Classic Piano",
      artist: "The_Mountain",
      src: "assets/music/song3.mp3",
      cover: "assets/covers/cover3.png",
      duration: "01:39"
    },
    {
      id: "8",
      title: "Classical - Classical Piano",
      artist: "HitsLab",
      src: "assets/music/song4.mp3",
      cover: "assets/covers/cover4.jpg",
      duration: "02:20"
    },
    {
      id: "10",
      title: "Classic",
      artist: "MVNoCopyrightMusic",
      src: "assets/music/song5.mp3",
      cover: "assets/covers/cover5.jpg",
      duration: "02:33"
    },
    { id: "11",
      title: "Classic",
      artist: "The_Mountain",
      src: "assets/music/song6.mp3",
      cover: "assets/covers/cover6.jpg",
      duration: "01:50"
    }
  ];

  let currentSongIndex = 0;
  let isPlaying = false;
  let isShuffle = false;
  let isLoop = false;
  let showCovers = true;
  let searchQuery = "";
  let lastVolume = 0.5;

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

  toggleCoverBtn.addEventListener("click", () => {
    showCovers = !showCovers;

    if (showCovers) {
      toggleCoverBtn.textContent = "Show Covers: on";
    } else {
      toggleCoverBtn.textContent = "Show Covers: off";
    }

    renderPlaylist();
  });

  resetPlayerBtn.addEventListener("click", () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
    isPlaying = false;
    btnPlayPause.textContent = "⏯";

    isLoop = false;
    isShuffle = false;
    audioEngine.loop = false;
    btnLoop.classList.remove("active");
    btnShuffle.classList.remove("active");

    searchQuery = "";
    songSearch.value = "";

    currentSongIndex = 0;

    renderPlaylist();
    loadSong(currentSongIndex);

    dropdownMenu.classList.remove('show');
  });

  songSearch.addEventListener("input", () => {
    searchQuery = songSearch.value.trim().toLowerCase();
    renderPlaylist();
  });

  btnPlayPause.addEventListener("click", togglePlay);

  btnLoop.addEventListener("click", () => {
    isLoop = !isLoop;

    audioEngine.loop = isLoop;

    if (isLoop) {
      btnLoop.classList.add("active");
    } else {
      btnLoop.classList.remove("active");
    }
  });

  btnShuffle.addEventListener("click", () => {
    isShuffle = !isShuffle;

    if (isShuffle) {
      btnShuffle.classList.add("active");
    } else {
      btnShuffle.classList.remove("active");
    }
  });

  playlistTracks.addEventListener("click", event => {
    const item = event.target.closest(".playlist-item");
    if (!item) return;

    const clickedIndex = parseInt(item.dataset.index, 10);

    currentSongIndex = clickedIndex;

    loadSong(currentSongIndex);

    isPlaying = false;
    togglePlay();
  });

  btnNext.addEventListener("click", nextSong);
  btnPrev.addEventListener("click", prevSong);

  audioEngine.addEventListener("timeupdate", () => {
    const current = audioEngine.currentTime;
    const duration = audioEngine.duration;

    timeCurrent.textContent = formatTime(current);

    if (duration) {
      progressBar.value = (current / duration) * 100;
    }
  });

  progressBar.addEventListener("input", () => {
    const duration = audioEngine.duration;
    if (!duration) return;

    const newTime = (progressBar.value / 100) * duration;

    audioEngine.currentTime = newTime;
  })

  volumeBar.addEventListener("input", () => {
    const currentVolume = volumeBar.value / 100;
    audioEngine.volume = currentVolume;

    if (currentVolume === 0) {
      btnMute.textContent = "🔇";
    } else if (currentVolume < 0.4){
      btnMute.textContent = "🔉";
    } else {
      btnMute.textContent = "🔊";
    }
  });

  btnMute.addEventListener("click", () => {
    if (audioEngine.volume > 0) {
      lastVolume = audioEngine.volume;

      audioEngine.volume = 0;
      volumeBar.value = 0;
      btnMute.textContent = "🔇";
    } else {
      audioEngine.volume = lastVolume;
      volumeBar.value = lastVolume * 100;

      if (lastVolume < 0.4) {
        btnMute.textContent = "🔉";
      } else {
        btnMute.textContent = "🔊";
      }
    }
  });

  audioEngine.addEventListener("ended", nextSong);

  function nextSong() {
    if (isShuffle && songs.length > 2) {
      let randomIndex;

      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === currentSongIndex);

      currentSongIndex = randomIndex;
    } else {
      currentSongIndex ++;

      if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
      }
    }

    loadSong(currentSongIndex);
    isPlaying = false;
    togglePlay();
  }

  function prevSong() {
    currentSongIndex --;

    if (currentSongIndex < 0) {
      currentSongIndex = songs.length - 1;
    }

    loadSong(currentSongIndex);
    isPlaying = false;
    togglePlay();
  }


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
    if (activePlaylistItem) activePlaylistItem.classList.add("active");
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

  function togglePlay() {
    if (isPlaying) {
      audioEngine.pause();
      btnPlayPause.textContent = "⏯";
      isPlaying = false;
    } else {
      audioEngine.play().catch(err => console.log("Playback interrupted:", err));
      btnPlayPause.textContent = "⏸";
      isPlaying = true;
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  audioEngine.volume = volumeBar.value / 100;
  renderPlaylist();
  loadSong(currentSongIndex);
});