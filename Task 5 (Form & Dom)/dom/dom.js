function reAdjustImage(element,position) {

    element.style.display = "flex";
    switch (position) {
        case "left":    element.style.justifyContent = "flex-start"  ;break;
        case "center":  element.style.justifyContent = "center"      ;break;
        case "right":   element.style.justifyContent = "flex-end"    ;break;
        default:        console.warn("Invalid position. Use 'left', 'center', or 'right'.");
    }
}

function reAdjustNavBullets()
{
    let nav = document.getElementById("nav");
    nav.style.listStyle = "inside";
}

////////////////////////////////////////////////////////////

const header = document.getElementById("header");
const footer = header.cloneNode(true); footer.id = "footer";

reAdjustImage(header , "right");
reAdjustImage(footer , "left");
document.body.appendChild(footer);

reAdjustNavBullets();