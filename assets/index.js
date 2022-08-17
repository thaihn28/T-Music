const baseURL = "https://server-tau-six.vercel.app/api/";
const chartHome = "charthome";
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
const btnRandomSong = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const playList = $(".playlist");

const app = {
  songs: {},
  listSong: [],
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  cdAnimate: {},
  getSong: function (encodeId) {
    fetch(baseURL + songURL + encodeId)
      .then((response) => response.json())
      .then((song) => {
        audio.src = song.data[128];
      })
      .catch((err) => console.log(err));
  },
  handleRenderSong: function () {
    const _this = this;
    this.listSong = this.songs.data.RTChart.items;
    heading.innerText = this.listSong[this.currentIndex].title;
    const thumbNail = `
    <div class="cd-thumb"
      style="background-image: url(${
        this.listSong[this.currentIndex].thumbnailM
      })">
    </div>`;
    cd.innerHTML = thumbNail;
    this.getSong(this.listSong[this.currentIndex].encodeId);
    const listSongHtmls = this.listSong.map((item, index) => {
      return `
      <div class="song ${index === this.currentIndex ? "active" : ""}">
      <div class="thumb" style="background-image: url(${
        item.thumbnailM
      })"></div>
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
    playList.innerHTML = listSongHtmls.join("");
    this.scrollToActiveSong();
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    const cdSpinning = [
      {
        transform: "rotate(360deg)",
      },
    ];
    const cdTiming = {
      duration: 10000,
      iterations: Infinity,
    };

    _this.cdAnimate = cd.animate(cdSpinning, cdTiming);
    _this.cdAnimate.pause();

    // document.onscroll = () => {
    //   const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //   let newCdWidth = cdWidth - scrollTop;
    //   cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
    //   cd.style.opacity = newCdWidth > 0 ? newCdWidth / cdWidth : '1';
    // };

    btnPlay.onclick = () => {
      if (audio.src && audio.src !== localURL) {
        if (_this.isPlaying) {
          audio.pause();
          _this.cdAnimate.pause();
        } else {
          audio.play();
          _this.cdAnimate.play();
        }
      }
    };
    // Play song
    audio.onplay = () => {
      _this.isPlaying = true;
      _this.cdAnimate.play();
      player.classList.add("playing");
    };
    //Pause song
    audio.onpause = () => {
      _this.isPlaying = false;
      player.classList.remove("playing");
    };
    // Update song progress
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const currentProgress = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = currentProgress;
      }
    };
    // Seek song
    progress.onchange = (event) => {
      const newTime = (audio.duration / 100) * event.target.value;
      audio.currentTime = newTime;
    };
    // Next song
    btnNext.onclick = () => {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      setTimeout(() => {
        audio.play();
      }, 5500);
    };
    // Prev song
    btnPrev.onclick = () => {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      setTimeout(() => {
        audio.play();
      }, 5500);
    };
    //Random Song
    btnRandomSong.onclick = () => {
      _this.isRandom = !_this.isRandom;
      btnRandomSong.classList.toggle("active");
    };
    // Repeat song
    btnRepeat.onclick = () => {
      _this.isRepeat = !this.isRepeat;
      btnRepeat.classList.toggle("active");
      if (_this.isRepeat) {
        _this.repeatSong();
      }
    };
    // On end song
    audio.onended = () => {
      if (_this.isRepeat) {
        _this.autoPlaySong();
      } else {
        _this.cdAnimate.pause();
        btnNext.click();
      }
    };
  },
  autoPlaySong: function () {
    setTimeout(() => {
      this.handleRenderSong();
    }, 1500);
    this.cdAnimate.pause();
    setTimeout(() => {
      audio.play();
    }, 4500);
  },
  scrollToActiveSong: function () {
    const activeSong = $(".song.active");
    window.scrollTo({
      top: activeSong.offsetTop,
      behavior: "smooth",
    });
  },
  nextSong: function () {
    this.cdAnimate.pause();
    if (this.isPlaying) {
      audio.pause();
    }
    this.currentIndex++;
    if (this.currentIndex >= this.listSong.length - 1) {
      this.currentIndex = 0;
    }
    setTimeout(() => {
      this.handleRenderSong();
    }, 2200);
  },
  prevSong: function () {
    if (this.isPlaying) {
      audio.pause();
    }
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.listSong.length - 1;
    }
    setTimeout(() => {
      this.handleRenderSong();
    }, 2200);
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.listSong.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    if (this.isPlaying) {
      audio.pause();
    }
    setTimeout(() => {
      this.handleRenderSong();
    }, 2500);
  },
  repeatSong: function () {
    this.currentIndex = this.currentIndex;
  },
  start: function () {
    this.handleRenderSong();
    this.handleEvents();
  },
};

function handleFetchAPI(callback) {
  const url = baseURL + chartHome;
  fetch(url)
    .then((response) => response.json())
    .then(callback);
}

function firstStart() {
  handleFetchAPI(getSongs);
}

function getSongs(data) {
  app.songs = data;
  app.start();
}
firstStart();
