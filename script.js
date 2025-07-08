console.log('hello');
let songs;
let csong;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

let currentsong = new Audio()
async function getsongs() {
    let a = await fetch("/songs/")
    let response = await a.text()
        let div = document.createElement('div')
        div.innerHTML=response  
        let as = div.getElementsByTagName("a")
        // console.log(as);    
        let songs =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // console.log(a)
            songs.push(element.href.split("/songs/")[1])  
        }
    }
    return songs
 
    
}
const playmusic=(track, pause=false)=>{
currentsong.src  = "/songs/" +track
if(!pause){

    currentsong.play()
    play.src="pause.svg"
}
document.querySelector(".songtime").innerHTML =" 00:00/00:00"
document.querySelector(".songinfo").innerHTML = decodeURI(track)

}
async function main() { 
    
    songs= await getsongs()
    playmusic(songs[0], true)
    console.log(songs);  
    let songsol = document.querySelector(".slists").getElementsByTagName("ol")[0]
    for (const song of songs) {
        songsol.innerHTML=songsol.innerHTML + `<li class="cont flex"> <img  class="invert" src="music.svg" alt="">
                        <div class="songname "><p>${song.replaceAll("%20"," ")}</p>
                        <p>CMA</p></div>
                <div class="playnow">Play Now</div>
                <img  class="invert" src="play.svg" alt="">
                    </li>`
        // `<li>${song.replaceAll("%20"," ")}</li>`;
    }
    csong = await getsongs()
    let cardsong = document.querySelector(".spotify-playlist").getElementsByClassName("cardcontainer")[0]
    for( const psong of csong){
        let cleanName = psong.replaceAll("%20", " ")
        let imagepath = cleanName.replace(".mp3",".jpg")
        console.log(imagepath);
        
    
        
        cardsong.innerHTML=cardsong.innerHTML+`<div class="card">
                        <svg width="40px" class="circ" height="40px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="32" cy="32" r="32" fill="#1fdf64" />
                                <polygon points="26,20 26,44 46,32" fill="#000000" />
                            </svg>
                        <img src="/songs/${imagepath}" alt="img">
                        <h4>${cleanName}</h4>
                        <p> </p>
                    </div>`
    }
    Array.from(document.querySelector(".slists").getElementsByTagName("li")).forEach(e=>{
       e.addEventListener("click", element=>{
           console.log(e.querySelector(".songname").firstElementChild.innerHTML.trim())
           playmusic(e.querySelector(".songname").firstElementChild.innerHTML.trim())

        })
    })
    Array.from(document.querySelector(".cardcontainer").getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",element=>{
                       console.log(e.querySelector("h4").innerHTML.trim())
                       playmusic(e.querySelector("h4").innerHTML.trim())


            
        })
    })
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="play.svg"
        }
    })
    currentsong.addEventListener("timeupdate",()=>{
            console.log(currentsong.currentTime, currentsong.duration)
            document.querySelector(".songtime").innerHTML= `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
            document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 + "%"
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent =(e.offsetX/e.target.getBoundingClientRect().width)* 100
        document.querySelector(".circle").style.left= percent + "%"
        currentsong.currentTime=((currentsong.duration)*percent)/100
    })  
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })
    document.querySelector("#next").addEventListener("click",()=>{
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    console.log(songs,index);
    if((index+1)<songs.length){
        playmusic(songs[index+1])
    }
    })
    document.querySelector("#prev").addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    console.log(songs,index);
    if((index-1)>=0){
        playmusic(songs[index-1])
    }
    })
    document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,e.target.value)
        currentsong.volume=e.target.value/100
    })

}
main()