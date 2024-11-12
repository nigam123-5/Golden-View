
function myfunction(){
    let menu_click = document.getElementById('mynavbar');
    let click_content = document.getElementById('content');

    if (menu_click.className === "navbar") {
        menu_click.className += " active";
        click_content.style.overflow = 'hidden';
    } 
    else {
        menu_click.className = "navbar";
        click_content.style.overflow = 'visible';
    }
}

var previousElement, colour;
function box(number){
    let first = document.getElementsByClassName('l1')[0];
    first.classList.remove('active_col');
    if (previousElement) {
        previousElement.classList.remove('active_ele');  
        colour.classList.remove('active_col');
    }
    
    previousElement = document.getElementById('box'+number);
    previousElement.classList.add('active_ele');
    colour = document.getElementsByClassName('l1')[number-1];
    colour.classList.add('active_col');
}
var previous;
function box__(number){
    if (previous) {
        previous.classList.remove('active_ele'); 
    }
    previous = document.getElementById('box'+ number);
    previous.classList.add('active_ele');
}

var swiper1 = new Swiper(".container0", {
    slidesPerView: 1,
    loop: true,
    speed: 1000,        //transition speed between the slides
    
    autoplay: {
        delay: 4000,                               //restart when in use
        disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination1",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next1",
      prevEl: ".swiper-button-prev1",
    },
  });

var swiper2 = new Swiper(".slide-content", {
    speed: 800,
    slidesPerView: 4,
    spaceBetween: 30,
    centerSlide: true,
    fade: true,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination2",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next2",
      prevEl: ".swiper-button-prev2",
    },
    breakpoints:{
        0 : {
            slidesPerView: 1,
        },
        520 : {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        920 : {
            slidesPerView: 3,
        },
        1200:{
            slidesPerView: 4,
        }
    }
  });

function changeColor(input) {
    if (input.checkValidity()) {  //checkValidity is a built-in JS method
        input.style.color = "black"; 
    } else {
        input.style.color = "white"; 
    }
}




    