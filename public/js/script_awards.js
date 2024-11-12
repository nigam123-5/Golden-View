function my_function(){
    let more = document.getElementById('extra');
    let button1 = document.getElementById('more');
    let button2 = document.getElementById('less');
    if (more.className === 'show_more'){
        more.className += ' activate';
        button1.style.display = 'none';
        button2.style.display = 'block';
    }
    else{
        more.className = 'show_more';
        button2.style.display = 'none';
        button1.style.display = 'block';
    }
}
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