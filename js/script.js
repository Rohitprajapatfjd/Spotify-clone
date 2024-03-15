let currFolder;
let songs = [];
async function main(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }
  
  let filtsong;
  let songname = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  
   songname.innerHTML = "";
  for (const song of songs) {
    if(song.includes("%20")){
    
      filtsong = song.replaceAll("%20"," ");
    }else{
        filtsong = song.replaceAll("_"," ");
    }
    songname.innerHTML =
      songname.innerHTML +
      ` <li>
                <img class="invert" src="./svg/music.svg" alt="" />
                <div class="info">${ filtsong }</div>                
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="./svg/playsong.svg" alt="" />
                </div>
              </li>`;
  }

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(
        e.querySelector(".info").innerHTML.trim()
      );
      if( e.querySelector(".info").innerHTML.includes(" ")){
         playMusic(e.querySelector(".info").innerHTML.trim());
      }else{
      playMusic(e.querySelector(".info").innerHTML.trim().replaceAll(" %20", " "));
      }
    });
  });
}

function secondtominuteSecond(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds /60);
  const remainingseconds = Math.floor(seconds % 60);
  const formatemin = String(minutes).padStart(2,'0');
  const formatesec = String(remainingseconds).padStart(2, "0");

  return `${formatemin}:${formatesec}`;
}

let play = document.querySelector("#play");
let currentsong = new Audio();

const playMusic = (track,pause=false) => {
  currentsong.src = `/${currFolder}/` + track;
  if(!pause){
    currentsong.play();
    play.src = "./svg/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track.replaceAll("%20"," ");
   document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

   
};
//display album function
 async function displayAlbum(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let divs = document.createElement("div");
  divs.innerHTML = response;
  let anchors = divs.getElementsByTagName("a");
   let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];    
    if(e.href.includes("/songs/")){
    let folder = e.href.split("/").slice(-1);
    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
    let response = await a.json();
    //console.log(response)
   
    cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-title="${response.title}" data-id="${folder}" class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  color="#000000"
                  fill="#00000"
                >
                  <path
                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                    stroke="currentColor"
                    stroke-width="1.0"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <img
                src="./songs/${folder}/cover.jpeg"
                alt=""
              />
              <h1 class="titles">${response.title}</h1>
              <p>${response.description}</p>
            </div>`

    }
  
  }
 // click anywhere in card songs playlist change
 Array.from(document.querySelectorAll(".card")).forEach(e=>{
  // console.log(e);
  e.addEventListener("click",async item=>{
   // console.log(e,item)
   // e.setAttribute("class","card active")
   await main(`songs/${e.dataset.id}`)
    playMusic(songs[0])
  })
  
  })
  const cards = document.querySelectorAll('.card');
  let naming = document.querySelector(".folder-name");
// Add a click event listener to each card
cards.forEach(card => {

    card.addEventListener('click', (e) => {   
     //console.log(e.currentTarget.dataset.title);
     naming.innerHTML = e.currentTarget.dataset.title;
        // Remove the 'active' class from all cards
        cards.forEach(c => {
            c.classList.remove('active');
        });

        // Add the 'active' class to the clicked card
        card.classList.add('active');
    });
});
 
 
 }
// display album end

// new function
async function main1() {
  await main("songs/ncs");
  playMusic(songs[0],true)
  
// display album song in card
 displayAlbum();

//end display album songs

  
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src="./svg/pause.svg";
    } else {
      currentsong.pause();
      play.src = "./svg/playsong.svg";
    }
  });
  currentsong.addEventListener("timeupdate",()=>{
// console.log(currentsong.currentTime,currentsong.duration)
document.querySelector(".songtime").innerHTML = `${secondtominuteSecond(currentsong.currentTime)}/${secondtominuteSecond(currentsong.duration)}`;
 document.querySelector(".circle").style.left = (currentsong.currentTime /currentsong.duration) * 100 + "%";
  })
  //add even in seekbar yo click event
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let change = (e.offsetX / e.target.getBoundingClientRect().width) * 100 ;
    document.querySelector(".circle").style.left = change;
    currentsong.currentTime = ((currentsong.duration)* change)/100;
  })
  // add Eventlistener for hamburger listener
  document.querySelector(".hamburger").addEventListener("click" ,(e)=>{
     document.querySelector(".left").style.left = 0;
  })
  // add Eventlistener for close hamburger listener
  document.querySelector(".close").addEventListener("click" ,(e)=>{
     document.querySelector(".left").style.left = "-100%";
  })
   // add Eventlistener for previous button
   previous.addEventListener("click",()=>{
   
    let index = songs.indexOf(currentsong.src.split("/")[5]);
 console.log(currentsong.src.split("/")[5])
    if((index - 1) >=0 ){
    playMusic(songs[index-1]);
    }
   })
    // add Eventlistener for next button
   next.addEventListener("click",()=>{
     let index = songs.indexOf(currentsong.src.split("/")[5]);
    if((index + 1) < songs.length ){
    playMusic(songs[index+1]);
    }
   })
   // add event for volume up and down
   document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentsong.volume = parseInt(e.target.value)/100;

   })
   document.querySelector(".volume >img").addEventListener("click",e=>{
    console.log(e.target.src)
    if(e.target.src.includes("volume.svg")){
      e.target.src ="./svg/mute.svg";
      currentsong.volume = 0;
       document.querySelector(".range").getElementsByTagName("input")[0].value = 0
    }else{
      currentsong.volume = .9;
        e.target.src ="./svg/volume.svg";
        document.querySelector(".range").getElementsByTagName("input")[0].value = 40.9
    }
   })
 
}
main1();
