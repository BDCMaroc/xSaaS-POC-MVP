// sidebar.js
function updateSidebar(place) {
    const sidebar = document.getElementById('place-details');
    const placeImage = document.getElementById('place-image');
    const placeTelephone = document.getElementById('place-telephone');
    const placePrice = document.getElementById('place-price');
    const placeSuperficie = document.getElementById('place-superficie');
    
    const imageUrls = place.Images_url ? place.Images_url.split(',').map(url => url.trim()) : [];
    let currentImageIndex = 0;
    
    function showImage(index) {
        placeImage.src = imageUrls[index] ? imageUrls[index] : ''; // Set to empty if no image
    }
    
    document.getElementById('prev-image').onclick = function() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            showImage(currentImageIndex);
        }
    };
    
    document.getElementById('next-image').onclick = function() {
        if (currentImageIndex < imageUrls.length - 1) {
            currentImageIndex++;
            showImage(currentImageIndex);
        }
    };
    
    showImage(currentImageIndex);
    placeTelephone.textContent = `Telephone: ${place.Telephone || 'N/A'}`;
    placePrice.textContent = `Price: ${place.Prix} DH`;
    placeSuperficie.textContent = `Superficie: ${place.Superficie}`;
    
    sidebar.style.display = 'block';
}

function updateSidebarforfutureplaces(place) {
    const sidebar = document.getElementById('place-details');
    const placeImage = document.getElementById('place-image');
    const placeDescription = document.getElementById('place-telephone');
    const placePrice = document.getElementById('place-price');
    const placeSuperficie = document.getElementById('place-superficie');

    const imageUrls = [place.pj, place.pj2, place.pj3].filter(url => url && url.trim() !== '');
    let currentImageIndex = 0;

    function showImage(index) {
        placeImage.src = imageUrls[index] ? `https://www.soliquar.com/Upload/uploads/${imageUrls[index]}` : '';
    }

    document.getElementById('prev-image').onclick = function() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            showImage(currentImageIndex);
        }
    };

    document.getElementById('next-image').onclick = function() {
        if (currentImageIndex < imageUrls.length - 1) {
            currentImageIndex++;
            showImage(currentImageIndex);
        }
    };

    showImage(currentImageIndex);
    placeDescription.textContent = `Description: ${place.quoi}`;
    placePrice.textContent = '';
    placeSuperficie.textContent = '';
    
    sidebar.style.display = 'block';
}