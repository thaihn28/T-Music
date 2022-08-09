const songsURL =
  "https://server-tau-six.vercel.app/api/detailplaylist?id=ZWZB969E";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const currentIndex = 0;

const app = {
  songs: {},
  handleFetchAPI: function(callback){
    fetch(songsURL)
    .then((response) => response.json())
    .then(callback);
  },
  handleRenderSong: function(songs){
    const songData = songs.data;
    console.log(songData);
    const thumbNail = `
    <div class="cd-thumb"
      style="background-image: url(${songData.song.items[currentIndex].thumbnailM})">
    </div>`;
    $(".cd").innerHTML = thumbNail;
  
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
  handleEvents: function(){
    const cd = $('.cd');
    const cdWidth = cd.offsetWidth;
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }
  },
  start: function() {
    this.handleFetchAPI(this.handleRenderSong);
    this.handleEvents();
  },
}

app.start();

