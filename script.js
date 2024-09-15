const searchBtn = document.querySelector(".btnInput");
const authorOfSong = document.querySelector("#authorOfSong");
const nameSong = document.querySelector("#nameSong");
const playButton = document.querySelector("#cntlIcon");
const playSong = document.querySelector("#song");
const progress = document.querySelector("#progress");
const chevronsLeft = document.querySelector("#chevrons-left");
const chevronsRight = document.querySelector("#chevrons-right");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchDataWithDelay(url, delayMs) {
  await delay(delayMs);
  return fetch(url);
}

searchBtn.addEventListener("click", asyncFunc);
async function asyncFunc() {
  const query = document.querySelector("#inputForSong").value;
  try {
    const response = await fetchDataWithDelay(
      `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${encodeURIComponent(
        query
      )}`,
      1000
    );
    const data = await response.json();
    console.log(data);

    const results = document.querySelector(".recomendations");
    results.innerHTML = "";
    data.data.forEach((track) => {
      const trackElement = document.createElement("span");
      trackElement.innerHTML = `<p><span>${track.title}</span> by ${track.artist.name}</p>`;
      authorOfSong.innerHTML = track.artist.name;
      nameSong.innerHTML = track.title;

      trackElement.addEventListener("click", () => {
        authorOfSong.innerHTML = track.artist.name;
        nameSong.innerHTML = track.title;
        playSong.src = track.preview;
        progress.max = playSong.duration;
        progress.value = playSong.currentTime;
        playButton.classList.remove("bx-play");
        playButton.classList.add("bx-pause");
        playSong.play();
        if (playSong.play) {
          setInterval(() => {
            progress.max = playSong.duration;
            progress.value = playSong.currentTime;
          }, 500);
        }
        progress.onchange = () => {
          playSong.play();
          playSong.currentTime = progress.value;
          playButton.classList.remove("bx-play");
          playButton.classList.add("bx-pause");
        };
      });
      results.appendChild(trackElement);
    });
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  }
}

playButton.addEventListener("click", () => {
  if (playSong.paused) {
    playButton.classList.remove("bx-play");
    playButton.classList.add("bx-pause");
    playSong.play();
  } else {
    playButton.classList.add("bx-play");
    playButton.classList.remove("bx-pause");
    playSong.pause();
  }
});

chevronsLeft.addEventListener("click", () => {
  playButton.classList.add("bx-play");
  playButton.classList.remove("bx-pause");
  progress.value = 0;
  playSong.currentTime = progress.value;
  playSong.pause();
});

chevronsRight.addEventListener("click", () => {
  progress.value = playSong.duration;
  playSong.currentTime = progress.value;
  playButton.classList.add("bx-play");
  playButton.classList.remove("bx-pause");
});

console.dir(progress);

window.addEventListener("keypress", (e) => {
  if (e.charCode == "13") {
    asyncFunc();
  }
});
