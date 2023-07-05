var currentSlideIndex = 0;
var slides = document.getElementsByClassName('slide');
var previousButton = document.getElementById('previousButton');
var nextButton = document.getElementById('nextButton');
var slidesContainer = document.getElementById('slidesContainer');
var player;

function showSlide(index) {
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slides[index].style.display = 'grid';

  previousButton.disabled = index === 0;
  nextButton.disabled = index === slides.length - 1;

  if (player && player.stopVideo) {
    player.stopVideo();
  }
}

function nextSlide() {
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
  }
}

function previousSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
  }
}

function createYouTubePlayer(videoId) {
  player = new YT.Player('youtubePlayer', {
    height: '315',
    width: '560',
    videoId: videoId,
  });
}

fetch('experience.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Het is niet gelukt de JSON data op te halen');
    }
    return response.json();
  })
  .then(data => {
    for (var i = 0; i < data.length; i++) {
      var slide = data[i];
      var slideElement = renderSlide(slide);
      slidesContainer.appendChild(slideElement);
    }
    showSlide(currentSlideIndex);
  })
  .catch(error => {
    console.error(error);
  });

function renderSlide(slide) {
  const slideTemplate = document.getElementById('slideTemplate');
  const slideElement = slideTemplate.content.cloneNode(true).querySelector('.slide');

  if (slide.left) {
    const leftElement = document.createElement('p');
    leftElement.id = 'Linksdeelding';
    slide.left.forEach(leftText => {
      const leftTextElement = document.createTextNode(leftText);
      leftElement.appendChild(leftTextElement);
      leftElement.appendChild(document.createElement('br'));
    });
    slideElement.querySelector('.Linksdeelding').appendChild(leftElement);
  }

  if (slide.video) {
    if (slide.video.includes('youtube.com')) {
      const videoId = extractYouTubeVideoId(slide.video);
      if (videoId) {
        const youtubePlayerElement = slideElement.querySelector('.viddeel');
        youtubePlayerElement.id = 'youtubePlayer';
        createYouTubePlayer(videoId);
      } else {
        slideElement.querySelector('.viddeel').style.display = 'none';
      }
    } else {
      const videoElement = document.createElement('img');
      videoElement.id = 'viddeel';
      videoElement.src = slide.video;
      videoElement.width = '560';
      videoElement.height = '315';
      slideElement.querySelector('.viddeel').appendChild(videoElement);
    }
  } else {
    slideElement.querySelector('.viddeel').style.display = 'none';
  }

  if (slide.right) {
    const rightElement = document.createElement('p');
    rightElement.id = 'Rechtsdeelding';
    slide.right.forEach(rightText => {
      const rightTextElement = document.createTextNode(rightText);
      rightElement.appendChild(rightTextElement);
      rightElement.appendChild(document.createElement('br'));
    });
    slideElement.querySelector('.Rechtsdeelding').appendChild(rightElement);
  }

  return slideElement;
}

nextButton.addEventListener('click', nextSlide);
previousButton.addEventListener('click', previousSlide);

function extractYouTubeVideoId(url) {
  var match = url.match(/(?:https?:\/\/(?:www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#\/]+)/i);
  return match && match[1].length === 11 ? match[1] : null;
}
