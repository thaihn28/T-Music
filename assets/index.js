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
const btnRandomSong = $(".btn-random");


const app = {
  songs: {},
  listSong: [],
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  getSong: function (encodeId) {
    fetch(baseURL + songURL + encodeId)
      .then((response) => response.json())
      .then((song) => {
        audio.src = song.data[128];
      })
      .catch(err => console.log(err));
  },
  handleRenderSong: function () {
    const _this = this;
    this.listSong = this.songs.data.song.items;
    heading.innerText = this.listSong[this.currentIndex].title;
    const thumbNail = `
    <div class="cd-thumb"
      style="background-image: url(${this.listSong[this.currentIndex].thumbnailM})">
    </div>`;
    cd.innerHTML = thumbNail;
    this.getSong(this.listSong[this.currentIndex].encodeId);

    const listSongHtmls = this.listSong.map((item, index) => {
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
    const divSongs = $$(".song");
    Array.from(divSongs).filter((item, index) => {
      // return index === _this.currentIndex ? $(`.position-${index}`).classList.add('active') : 'GGG';
      return index === _this.currentIndex ? $(`.${item.className}`).classList.add('active') : '';
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Handle spin CD
    const cdSpinning = [
      {
      transform : 'rotate(360deg)'
    }
  ];
    const cdTiming = {
      duration: 10000,
      iterations: Infinity
    }

    const cdAnimate = cd.animate(
      cdSpinning,
      cdTiming
    );
    cdAnimate.pause();

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
          cdAnimate.pause();
        } else {
          audio.play();
          cdAnimate.play();
        }
      }
    };
    // Play song
    audio.onplay = () => {
      _this.isPlaying = true;
      cdAnimate.play();
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
    }
    // Next song
    btnNext.onclick = () => {
      if(_this.isRandom){
        _this.playRandomSong();
      }else{
        _this.nextSong();
      }
      setTimeout(() => {
        audio.play();
      }, 5000);

    }
    // Prev song
    btnPrev.onclick = () => {
      if(_this.isRandom){
        _this.playRandomSong();
      }else{
      _this.prevSong();
      }
      setTimeout(() => {
        audio.play();
      }, 5000);
    }
    //Random Song
    btnRandomSong.onclick = (event) => {
      _this.isRandom = !_this.isRandom;
      console.log(_this.isRandom);
      btnRandomSong.classList.toggle('active');
    }
  },
  nextSong: function () {
      this.currentIndex++;
      if(this.currentIndex >= this.listSong.length - 1) {
        this.currentIndex = 0;
      }
      setTimeout(() => {
        this.handleRenderSong();
      }, 2500);
  },
  prevSong: function () {
      this.currentIndex--;
      if(this.currentIndex < 0){
        this.currentIndex = this.listSong.length - 1;
      }
      setTimeout(() => {
        this.handleRenderSong();
      }, 2500);
  },
  playRandomSong: function(){
    let newIndex;
    do{
      newIndex = Math.floor(Math.random() * this.listSong.length);
    }while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    setTimeout(() => {
      this.handleRenderSong();
    }, 2500);
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
