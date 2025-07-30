document.addEventListener('DOMContentLoaded', () => {

    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = document.getElementById('play-pause-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const seekSlider = document.getElementById('seek-slider');
    const currentTimeSpan = document.getElementById('current-time');
    const totalDurationSpan = document.getElementById('total-duration');
    const volumeSlider = document.getElementById('volume-slider');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const coverArt = document.getElementById('cover-art');
    const playlistContainer = document.getElementById('playlist');

    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function loadSong(index) {
        if (songs.length === 0) return;

        const song = songs[index];
        audioPlayer.src = song.src;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        coverArt.src = song.cover;

        document.querySelectorAll('.playlist-item').forEach((item) => {
            item.classList.remove('active');
            const itemPlayIcon = item.querySelector('.fa-play');
            const itemPauseIcon = item.querySelector('.fa-pause');
            if (itemPlayIcon) itemPlayIcon.style.display = 'inline-block';
            if (itemPauseIcon) itemPauseIcon.style.display = 'none';
        });

        const activeItem = playlistContainer.querySelector(`[data-index="${index}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            const activeItemPlayIcon = activeItem.querySelector('.fa-play');
            const activeItemPauseIcon = activeItem.querySelector('.fa-pause');
            if (isPlaying) {
                if (activeItemPlayIcon) activeItemPlayIcon.style.display = 'none';
                if (activeItemPauseIcon) activeItemPauseIcon.style.display = 'inline-block';
            } else {
                if (activeItemPlayIcon) activeItemPlayIcon.style.display = 'inline-block';
                if (activeItemPauseIcon) activeItemPauseIcon.style.display = 'none';
            }
        }

        updateBackgroundGradient(); // Dynamic background
    }

    function playSong() {
        isPlaying = true;
        audioPlayer.play();
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
        updatePlaylistIcon(currentSongIndex, true);
    }

    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
        updatePlaylistIcon(currentSongIndex, false);
    }

    function updatePlaylistIcon(index, playing) {
        const item = playlistContainer.querySelector(`[data-index="${index}"]`);
        if (item) {
            const itemPlayIcon = item.querySelector('.fa-play');
            const itemPauseIcon = item.querySelector('.fa-pause');
            if (playing) {
                if (itemPlayIcon) itemPlayIcon.style.display = 'none';
                if (itemPauseIcon) itemPauseIcon.style.display = 'inline-block';
            } else {
                if (itemPlayIcon) itemPlayIcon.style.display = 'inline-block';
                if (itemPauseIcon) itemPauseIcon.style.display = 'none';
            }
        }
    }

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });

    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        seekSlider.value = progressPercent;
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        totalDurationSpan.textContent = formatTime(audioPlayer.duration);
        seekSlider.max = audioPlayer.duration;
    });

    seekSlider.addEventListener('input', () => {
        const seekTime = (seekSlider.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value / 100;
    });

    audioPlayer.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });

    function populatePlaylist() {
        playlistContainer.innerHTML = '';
        songs.forEach((song, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.classList.add(
                'playlist-item', 'flex', 'items-center', 'p-3', 'rounded-lg',
                'bg-white', 'bg-opacity-5', 'hover:bg-opacity-10',
                'transition-colors', 'duration-200', 'cursor-pointer', 'relative'
            );
            playlistItem.setAttribute('data-index', index);

            playlistItem.innerHTML = `
                <img src="${song.cover}" alt="${song.title} Cover" class="w-10 h-10 rounded-md mr-3">
                <div class="flex-grow">
                    <p class="text-white font-medium text-base">${song.title}</p>
                    <p class="text-gray-300 text-sm">${song.artist}</p>
                </div>
                <i class="fas fa-play text-gray-400 text-lg absolute right-3 top-1/2 -translate-y-1/2"></i>
                <i class="fas fa-pause text-purple-400 text-lg absolute right-3 top-1/2 -translate-y-1/2" style="display: none;"></i>
            `;

            playlistItem.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });

            playlistContainer.appendChild(playlistItem);
        });
    }

    function fetchSongs() {
        songs = [
            {
                title: "Chennai Express",
                artist: "Unknown Artist",
                src: "songs/Chennai Express.mp3",
                cover: "https://placehold.co/256x256/6B7280/FFFFFF?text=C"
            },
            {
                title: "End of Beginning",
                artist: "Djo",
                src: "songs/Djo - End of Beginning (Official Lyric Video)(MP3_320K).mp3",
                cover: "https://placehold.co/256x256/444444/FFFFFF?text=E"
            },
            {
                title: "Perfect",
                artist: "Ed Sheeran",
                src: "songs/Ed Sheeran - Perfect (Official Music Video)(MP3_320K).mp3",
                cover: "https://placehold.co/256x256/FF69B4/FFFFFF?text=P"
            },
            {
                title: "End of Beginning X Pookale",
                artist: "Mashup",
                src: "songs/End of beginning X pookale(MP3_320K).mp3",
                cover: "https://placehold.co/256x256/AA00FF/FFFFFF?text=E"
            },
            {
                title: "I Wanna Be Yours",
                artist: "Unknown Artist",
                src: "songs/I Wanna Be Yours(MP3_320K).mp3",
                cover: "https://placehold.co/256x256/333333/FFFFFF?text=I"
            },
            {
                title: "Interstellar BGM",
                artist: "Hans Zimmer",
                src: "songs/Interstellar BGM.mp3",
                cover: "https://placehold.co/256x256/0F172A/FFFFFF?text=I"
            },
            {
                title: "Ordinary Person",
                artist: "Anirudh",
                src: "songs/LEO - Ordinary Person Lyric _ Thalapathy Vijay_ Anirudh Ravichander_ Lokesh Kanagaraj_ NikhitaGandhi(MP3_160K).mp3",
                cover: "https://placehold.co/256x256/8B5CF6/FFFFFF?text=O"
            },
            {
                title: "Let Her Go",
                artist: "Passenger ft. Ed Sheeran",
                src: "songs/Passenger - Let Her Go (Lyrics) (ft. Ed Sheeran).mp3",
                cover: "https://placehold.co/256x256/3B82F6/FFFFFF?text=L"
            },
            {
                title: "Dandelions",
                artist: "Ruth B.",
                src: "songs/Ruth B. - Dandelions (Lyrics).mp3",
                cover: "https://placehold.co/256x256/16A34A/FFFFFF?text=D"
            },
            {
                title: "Until I Found You",
                artist: "Stephen Sanchez",
                src: "songs/Stephen Sanchez - Until I Found You (Official Video)(MP3_320K).mp3",
                cover: "https://placehold.co/256x256/EA580C/FFFFFF?text=U"
            },
            {
                title: "Sweater Weather",
                artist: "Unknown Artist",
                src: "songs/Sweater Weather.mp3",
                cover: "https://placehold.co/256x256/EF4444/FFFFFF?text=S"
            },
            {
                title: "The Dark Knight BGM",
                artist: "Hans Zimmer",
                src: "songs/The Dark Knight BGM.mp3",
                cover: "https://placehold.co/256x256/111827/FFFFFF?text=D"
            }
        ];

        populatePlaylist();
        if (songs.length > 0) {
            loadSong(currentSongIndex);
            audioPlayer.volume = volumeSlider.value / 100;
        }
    }

    function updateBackgroundGradient() {
        const randomColor1 = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
        const randomColor2 = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
        document.body.style.background = `linear-gradient(to bottom right, ${randomColor1}, ${randomColor2})`;
    }

    fetchSongs();
});
