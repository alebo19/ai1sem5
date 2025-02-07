const msg: string = "Hello!";
alert(msg);

// Obiekt przechowujący dostępne style
const styles: { [key: string]: string } = {
    "Dark": "style/style1.css",
    "Light": "style/style2.css",
    "Blue": "style/style3.css",
};

// Funkcja zmieniająca styl strony
function changeStyle(styleName: string) {
    const existingLink = document.getElementById("dynamic-style") as HTMLLinkElement;

    if (existingLink) {
        existingLink.href = styles[styleName];
    } else {
        const link = document.createElement("link");
        link.id = "dynamic-style";
        link.rel = "stylesheet";
        link.href = styles[styleName];
        document.head.appendChild(link);
    }
}

// Tworzenie dynamicznych przycisków do zmiany stylów
function createStyleButtons() {
    const container = document.createElement("div");
    container.id = "style-buttons";

    for (const style in styles) {
        const button = document.createElement("button");
        button.innerText = style;
        button.onclick = () => changeStyle(style);
        container.appendChild(button);
    }

    document.body.prepend(container);
}
document.addEventListener("DOMContentLoaded", () => {
    createStyleButtons();
});
