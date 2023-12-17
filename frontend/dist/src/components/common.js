"use strict";
let exit = document.getElementById('sidebar-dropdown-name-exit');
let profileFullNameElement = document.getElementById('profile-full-name');
if (profileFullNameElement) {
    profileFullNameElement.onclick = function () {
        if (exit) {
            if (exit.style.display === 'block') {
                exit.style.display = 'none';
            }
            else {
                exit.style.display = 'block';
            }
        }
    };
}
let mainSvgElement = document.querySelector('.main-svg');
if (mainSvgElement) {
    mainSvgElement.style.fill = 'white';
}
//# sourceMappingURL=common.js.map