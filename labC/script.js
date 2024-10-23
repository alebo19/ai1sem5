var map = L.map('map').setView([53.4481, 14.5372], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

function getLocation() {
    map.locate({setView: true, maxZoom: 18});
    map.on('locationfound', function (event) {
        map.flyTo(event.latlng, 18);
        document.getElementById("latitude").value = event.latlng.lat;
        document.getElementById("longitude").value = event.latlng.lng;
    });
    document.getElementById("location").disabled = true;
}

function doImage() {
    map.zoomControl.remove();
    leafletImage(map, function(err, canvas){
        var imageElement = document.createElement("img");
        var dimensions = map.getSize();
        imageElement.id = "image";
        imageElement.width = dimensions.x;
        imageElement.height = dimensions.y;
        imageElement.src = canvas.toDataURL();
        document.getElementById("map").style.display = "none";
        var resultDiv = document.getElementById("result");
        resultDiv.style.width = "auto";
        resultDiv.style.height = "auto";
        resultDiv.style.float = "left";
        resultDiv.style.marginLeft = "40px";
        resultDiv.appendChild(imageElement);
        document.getElementById("raster").disabled = true;
        document.getElementById("puzzle").disabled = false;
    });
}

function makePuzzle() {
    var image = document.getElementById("image");
    var imagePieces = [];
    var pieceWidth = image.width / 4;
    var pieceHeight = image.height / 4;

    for (var x = 0; x < 4; ++x) {
        for (var y = 0; y < 4; ++y) {
            var canvas = document.createElement('canvas');
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;
            var context = canvas.getContext('2d');
            context.drawImage(image, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, canvas.width, canvas.height);
            imagePieces.push(canvas.toDataURL());
        }
    }

    for (var i = 0; i < 16; i++){
        var img = document.createElement("img");
        img.src = imagePieces[i];
        img.style.position = "absolute";
        img.draggable = true;
        img.className = "draggable";
        img.id = i.toString();
        document.getElementById('mixedPuzzleContainer').children[i].innerHTML = '';
        document.getElementById('mixedPuzzleContainer').children[i].appendChild(img);
    }

    const grid = document.querySelector('#mixedPuzzleContainer');
    for(let i = 16; i >= 0; i--) {
        grid.appendChild(grid.children[Math.random() * i | 0]);
    }

    document.getElementById("puzzle").disabled = true;

    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.sp');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });
    });

    draggables.forEach(draggable => {
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const draggable = document.querySelector('.dragging');
            container.appendChild(draggable);
        });
    });

    var points = 0
    containers.forEach(container => {
        container.addEventListener('drop', () => {
            if(container.id === container.children[0].id){
                points++
                console.log("dobrze");
            }
            else{
                console.log("zle");
            }
            if(isSolution(points)){
                alert("BRAWO!!!");
                console.log("brawo");
            }
        })
    })

}

function isSolution(points){
    return (points===16) ? true : false
}