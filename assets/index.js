const baseURL = "https://server-tau-six.vercel.app/api/";
const playlistURL = "detailplaylist?id=ZWZB969E";
const songURL = "song?id=";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const localURL = "http://127.0.0.1:5500/";

let currentIndex = 0;
const heading = $("header h2");
const audio = $("audio");
const cd = $(".cd");
const btnPlay = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");

const app = {
  isPlaying: false,
  handleFetchAPI: function (callback) {
    fetch(baseURL + playlistURL)
      .then((response) => response.json())
      .then(callback);
  },
  getSong: function (encodeId) {
    fetch(baseURL + songURL + encodeId)
      .then((response) => response.json())
      .then((song) => {
        audio.src = song.data[128];
      });
  },
  handleRenderSong: function (songs) {
    const songData = songs.data;
    heading.innerText = songData.song.items[currentIndex].title;
    const thumbNail = `
    <div class="cd-thumb"
      style="background-image: url(${songData.song.items[currentIndex].thumbnailM})">
    </div>`;
    cd.innerHTML = thumbNail;
    this.getSong(songData.song.items[currentIndex].encodeId);

    const listSongHtmls = songData.song.items.map((item) => {
      return `
      <div class="song">
      <div class="thumb" style="background-image: url(${item.thumbnailM})"></div>
      <div class="body">
        <h3 class="title">${item.title}</h3>
        <p class="author">${item.artistsNames}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
      `;
    });
    $(".playlist").innerHTML = listSongHtmls.join("");
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    btnPlay.onclick = () => {
      if (audio.src && audio.src !== localURL) {

        if (_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
        
      }
    };
    // Khi song được play
    audio.onplay = () => {
      _this.isPlaying = true;
      player.classList.add("playing");
    };
    // Khi song bị pause
    audio.onpause = () => {
      _this.isPlaying = false;
      player.classList.remove("playing");
    };
    // Seek song
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const currentProgress = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = currentProgress;
      }
    };
    // Tua bài hát
    progress.onchange = (event) => {
      const newTime = (audio.duration / 100) * event.target.value;
      console.log(newTime);
      audio.currentTime = newTime;
    }
    _this.nextSong(_this);
  },
  nextSong: function (_this) {
    btnNext.onclick = () => {
      currentIndex++;
    }
  },
  start: function () {
    this.handleFetchAPI((songs) => this.handleRenderSong(songs));
    this.handleEvents();
  },
};

app.start();
