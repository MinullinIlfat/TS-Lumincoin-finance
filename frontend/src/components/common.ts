let exit: HTMLElement | null = document.getElementById('sidebar-dropdown-name-exit');
let profileFullNameElement: HTMLElement | null = document.getElementById('profile-full-name');

if (profileFullNameElement) {
    profileFullNameElement.onclick = function ():void {
        if (exit) {
            if (exit.style.display === 'block') {
                exit.style.display = 'none';
            } else if (exit.style.display === 'none' || exit.style.display === null) {
                exit.style.display = 'block';
            }
        }
    }
}


let mainSvgElement: HTMLElement | null = document.querySelector('.main-svg');
if (mainSvgElement) {
    mainSvgElement.style.fill = 'white';
}
