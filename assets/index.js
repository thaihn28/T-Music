const baseURL = "https://server-tau-six.vercel.app/api/";
const playlistURL = "detailplaylist?id=ZWZB969E";
const songURL = "song?id=";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const localURL = "http://127.0.0.1:5500/";

const heading = $("header h2");
const audio = $("audio");
const cd = $(".cd");
const btnPlay = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");



const app = {
  songs: {},
  listSong: [],
  currentIndex: 0,
  isPlaying: false,
  getSong: function (encodeId) {
    fetch(baseURL + songURL + encodeId)
      .then((response) => response.json())
      .then((song) => {
        audio.src = song.data[128];
      });
  },
  handleRenderSong: function () {
    this.listSong = this.songs.data.song.items;
    heading.innerText = this.listSong[this.currentIndex].title;
    const thumbNail = `
    <div class="cd-thumb"
      style="background-image: url(${this.listSong[this.currentIndex].thumbnailM})">
    </div>`;
    cd.innerHTML = thumbNail;
    this.getSong(this.listSong[this.currentIndex].encodeId);

    const listSongHtmls = this.listSong.map((item) => {
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
      audio.currentTime = newTime;
    }
    btnNext.onclick = () => {
      _this.nextSong();
      console.log(this.currentIndex);
      console.log(this.listSong[this.currentIndex].encodeId, this.listSong[this.currentIndex].title);
      setTimeout(() => {
        console.log(audio.src);
        audio.play();
      }, 2000)
    }
    btnPrev.onclick = () => {
      _this.prevSong();
      console.log(this.currentIndex);
      console.log(this.listSong[this.currentIndex].encodeId, this.listSong[this.currentIndex].title);
      audio.play();
    }
  },
  nextSong: function () {
      this.currentIndex++;
      if(this.currentIndex >= this.songs.data.song.items.length - 1) {
        this.currentIndex = 0;
      }
      this.handleRenderSong();
  },
  prevSong: function () {
      this.currentIndex--;
      if(this.currentIndex < 0){
        this.currentIndex = this.songs.data.song.items.length - 1;
      }
      this.handleRenderSong();
  },
  start: function () {
    this.handleRenderSong();
    this.handleEvents();
  },
};

function handleFetchAPI(callback){
  const url = baseURL + playlistURL;
  fetch(url)
  .then((response) => response.json())
  .then(callback);

}

function firstStart(){
  handleFetchAPI(getSongs);
}

function getSongs(data){
  app.songs = data;
  app.start();
}
firstStart();
