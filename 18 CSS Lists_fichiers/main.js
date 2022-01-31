const videos = document.querySelectorAll("video")
videos.forEach(video => {
  video.addEventListener("mouseover", function () {
    this.play()
  })
  video.addEventListener("mouseout", function () {
    this.pause()
  })
  video.addEventListener("touchstart", function () {
    this.play()
  })
  video.addEventListener("touchend", function () {
    this.pause()
  })
});








window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 5000 || document.documentElement.scrollTop > 5000) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}


function topFunction() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
}