const map = L.map('map').setView([41.404173, 2.174332], 5);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

navigator.geolocation.getCurrentPosition(
    position => console.log("Geolocation permission granted."),
    error => console.log("Geolocation permission denied.")
);
Notification.requestPermission().then(result => {
    if (result === 'granted') {
        console.log("Notification permission granted.");
    }
});

document.getElementById("mojalokalizacja").addEventListener("click", function() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup('Twoja lokalizacja')
            .openPopup();
    });
});

document.getElementById("pobierzmapa").addEventListener("click", function() {
    document.querySelector('.leaflet-control-zoom').style.display = 'none';
    leafletImage(map, function(err, canvas) {
        document.querySelector('.leaflet-control-zoom').style.display = '';
        const img = document.getElementById('map-screenshot');
        img.src = canvas.toDataURL();
        img.style.display = 'block';
        splitImage(canvas);
    });
});

function splitImage(canvas) {
    const puzzleBoard = document.getElementById("puzzle-board");
    puzzleBoard.innerHTML = '';
    const pieceSize = 80;
    const pieces = [];

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const piece = document.createElement("div");
            piece.classList.add("puzzle-piece");
            piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
            piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;
            piece.draggable = true;
            piece.dataset.index = y * 4 + x;
            pieces.push(piece);
        }
    }

    pieces.sort(() => Math.random() - 0.5).forEach(piece => puzzleBoard.appendChild(piece));

    pieces.forEach(piece => {
        piece.addEventListener("dragstart", dragStart);
    });

    const assemblyArea = document.getElementById("assembly-area");
    assemblyArea.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const dropZone = document.createElement("div");
        dropZone.classList.add("puzzle-piece");
        dropZone.dataset.index = i;
        dropZone.addEventListener("drop", drop);
        dropZone.addEventListener("dragover", dragOver);
        assemblyArea.appendChild(dropZone);
    }
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.dataset.index);
}

function drop(event) {
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData("text");
    const draggedPiece = document.querySelector(`[data-index='${draggedIndex}']`);
    const targetPiece = event.target;

    if (!targetPiece.style.backgroundImage) {
        targetPiece.style.backgroundImage = draggedPiece.style.backgroundImage;
        targetPiece.style.backgroundPosition = draggedPiece.style.backgroundPosition;
        targetPiece.dataset.index = draggedPiece.dataset.index;

        draggedPiece.style.backgroundImage = '';
        draggedPiece.style.backgroundPosition = '';
        draggedPiece.dataset.index = '';
    } else {
        const tempBackgroundImage = targetPiece.style.backgroundImage;
        const tempBackgroundPosition = targetPiece.style.backgroundPosition;
        const tempIndex = targetPiece.dataset.index;

        targetPiece.style.backgroundImage = draggedPiece.style.backgroundImage;
        targetPiece.style.backgroundPosition = draggedPiece.style.backgroundPosition;
        targetPiece.dataset.index = draggedPiece.dataset.index;

        draggedPiece.style.backgroundImage = tempBackgroundImage;
        draggedPiece.style.backgroundPosition = tempBackgroundPosition;
        draggedPiece.dataset.index = tempIndex;
    }

    checkIfComplete();
}

function dragOver(event) {
    event.preventDefault();
}

function checkIfComplete() {
    const pieces = Array.from(document.querySelectorAll("#assembly-area .puzzle-piece"));
    const isComplete = pieces.every((piece, index) => {
        return piece.dataset.index == index && piece.style.backgroundImage;
    });

    if (isComplete) {
        setTimeout(() => {
            if (Notification.permission === "granted") {
                new Notification("Puzzle ułożone!");
            } else {
                alert("Puzzle ułożone!");
            }
        }, 500);
    } else {
        console.log("Puzzle jeszcze nie są ułożone.");
    }
}
