window.addEventListener('DOMContentLoaded', (event) => {
    applyTheme();
});


let themeSwitcher = document.querySelector('#theme-switcher');
themeSwitcher.addEventListener('click', function(){
    switchTheme();
});
function getCurrentThemeMode()
{
    let theme = localStorage.getItem('theme');
    return theme;
}

function switchTheme()
{
    if(getCurrentThemeMode() =='light'){
        activateDarkTheme();
    }else{
        activateLightTheme();
    }

}

function applyTheme()
{
    if(getCurrentThemeMode() =='dark'){
        activateDarkTheme();
    }else{
        activateLightTheme();
    }

}

function activateDarkTheme()
{
    let root = document.getElementsByTagName('html')[0];
    root.classList.add('dark-theme');
    let images = document.querySelectorAll('img');
    images.forEach(function(img){
        img.classList.add('dark-theme-image');
    });

    toggler.classList.add('fa-toggle-on');
    toggler.classList.remove('fa-toggle-off');
    toggler.setAttribute('title','Enable Light Mode');
   

    localStorage.setItem('theme','dark');
}


function activateLightTheme(){
    let root = document.getElementsByTagName('html')[0];
    let toggler = document.querySelector('#toggler');
    root.classList.remove('dark-theme');
    let images = document.querySelectorAll('img');
    images.forEach(function(img){
        img.classList.remove('dark-theme-image');
    });

    toggler.classList.remove('fa-toggle-on');
    toggler.classList.add('fa-toggle-off');

    toggler.setAttribute('title','Enable Dark Mode');


    localStorage.setItem('theme','light');

}