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