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


document.addEventListener("DOMContentLoaded", function () {
    const stars = document.querySelectorAll(".star");

    stars.forEach(star => {
        star.addEventListener("mouseover", function () {
            let value = this.getAttribute("data-value");
            highlightStars(value);
        });

        star.addEventListener("mouseout", function () {
            resetStars();
        });

        star.addEventListener("click", function () {
            let value = this.getAttribute("data-value");
            setRating(value);
        });
    });

    function highlightStars(value) {
        stars.forEach(star => {
            if (star.getAttribute("data-value") <= value) {
                star.classList.add("checked");
            } else {
                star.classList.remove("checked");
            }
        });
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove("checked");
        });
    }

    function setRating(value) {
        stars.forEach(star => {
            if (star.getAttribute("data-value") <= value) {
                star.classList.add("checked");
            } else {
                star.classList.remove("checked");
            }
        });
    }
});
