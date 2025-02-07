let map;
let imageMap; // Zmienna do przechowywania mapy w formie obrazu

// Inicjalizacja mapy
function initMap() {
    map = L.map('map').setView([51.505, -0.09], 13); // Inicjalizacja mapy w domyślnej lokalizacji
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Warstwa mapy
}

// Pobieranie mapy (przy kliknięciu przycisku "Pobierz mapę")
document.getElementById("getMapButton").addEventListener("click", function() {
    // Zrób zrzut ekranu z mapy
    html2canvas(document.getElementById('map')).then(function(canvas) {
        imageMap = canvas; // Zapisujemy obraz mapy
        const imgData = canvas.toDataURL('image/png'); // Pobieramy dane obrazu
        splitImage(imgData); // Dzielimy mapę na kawałki
    });
});

// Dzielimy obraz mapy na 16 kawałków
function splitImage(imageData) {
    const image = new Image();
    image.src = imageData;

    image.onload = function() {
        const rows = 4;  // Podziel na 4 wiersze
        const cols = 4;  // Podziel na 4 kolumny
        const width = image.width / cols;
        const height = image.height / rows;

        let pieces = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;

                // Obcinamy kawałek obrazu
                ctx.drawImage(
                    image,
                    col * width, row * height, width, height,  // Źródło
                    0, 0, width, height  // Cel
                );

                const imgPiece = canvas.toDataURL('image/png'); // Kawałek obrazu w formie Data URL
                pieces.push(imgPiece); // Dodajemy do tablicy kawałków

                // Tworzymy element div dla każdego kawałka
                createPiece(imgPiece, row, col);
            }
        }
    };
}

// Tworzymy elementy dla kawałków mapy
function createPiece(imgPiece, row, col) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.setAttribute('draggable', 'true');
    piece.style.backgroundImage = `url(${imgPiece})`;
    piece.style.backgroundSize = 'cover';
    piece.style.width = '100px'; // Szerokość kawałka
    piece.style.height = '100px'; // Wysokość kawałka
    piece.setAttribute('data-correct-position', `${row}-${col}`); // Zapamiętujemy poprawną pozycję
    piece.setAttribute('data-position', `${row}-${col}`); // Początkowa pozycja

    // Dodajemy kawałek do planszy
    document.getElementById('board').appendChild(piece);
}

// Ustawienia mapy po kliknięciu "Moja lokalizacja"
document.getElementById("locationButton").addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            alert(`Twoja lokalizacja: Latitude: ${lat}, Longitude: ${lon}`);

            // Wyświetl lokalizację na mapie
            map.setView([lat, lon], 13);
            L.marker([lat, lon]).addTo(map);
        });
    } else {
        alert("Geolokalizacja jest niedostępna.");
    }
});
