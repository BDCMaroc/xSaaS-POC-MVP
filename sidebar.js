// sidebar.js
function updateSidebar(place) {
    const sidebar = document.getElementById('place-details');
    const placeImage = document.getElementById('place-image');
    const placeTelephone = document.getElementById('place-telephone');
    const placePrice = document.getElementById('place-price');
    const placeSuperficie = document.getElementById('place-superficie');
    const placeVille = document.getElementById('place-ville');
const placeDate = document.getElementById('place-date');
const placeEtage = document.getElementById('place-etage');
const placeTerrasse = document.getElementById('place-terrasse');
const placeBalcon = document.getElementById('place-balcon');
const placeTitle = document.querySelector('.title');
const placeBadge = document.querySelector('.badge');
    
const imageUrls = place.Images_url ? place.Images_url.split(',').map(url => url.trim()) : [];
let currentImageIndex = 0;
const imageContainer = document.getElementById('image-container');

// Function to show the current image
function showImage(index) {
    document.getElementById('place-image').src = imageUrls[index] ? imageUrls[index] : '';
}

// Function to update the hover image
function updateHoverImage(index) {
    if (imageUrls[index]) {
        imageContainer.style.setProperty('--next-image', `url(${imageUrls[index]})`);
    }
}

// Event listener for mouseover to transition to the next image (second image)
imageContainer.addEventListener('mouseover', function() {
    const nextIndex = 1;  // Always use the second image
    if (imageUrls.length > 1) {
        updateHoverImage(nextIndex);
        imageContainer.classList.add('hover');  // Trigger the hover effect
    }
});

// Event listener for mouseout to revert to the original image (first image)
imageContainer.addEventListener('mouseout', function() {
    imageContainer.classList.remove('hover');  // Remove the hover effect
    setTimeout(() => {
        updateHoverImage(currentImageIndex);  // Update the image after the transition ends
    }, 1000);  // Match the duration of the transition
});

// Initial display of the first image
showImage(currentImageIndex);


    let replacement;
    if(place.Étage){
        replacement = place.Étage + ' Etage';
    }
    if(!place.Étage && place.Nb_de_façades){
        replacement = place.Nb_de_façades + ' Nb façades';
    }
    else{
        replacement = place.Parking + ' Parking';
    }
    showImage(currentImageIndex);
    placePrice.textContent = `${place.Prix} DH`;
    placeSuperficie.textContent = `${place.Superficie} Sup`;
    placeVille.textContent = `${place.Ville || 'N/A'}`;
    placeDate.textContent = `${place.Date.slice(0, 10) || 'N/A'}`;
    placeEtage.textContent = `${replacement}`;
    placeTerrasse.textContent = `${place.Terrasse ? '1' : '0'} Terasse`;
    placeBalcon.textContent = `${place.Balcon} Balcon`;

        // Update the title and badge based on the transaction type
        if (place.Transaction === 'Vente') {
            placeTitle.textContent = `${place.Type_de_bien || 'Property'} for sale`;
            placeBadge.style.backgroundColor = 'rgb(10, 128, 31)'; // Green color for sale
        } else if (place.Transaction === 'Location') {
            placeTitle.textContent = `${place.Type_de_bien || 'Property'} for rent`;
            placeBadge.style.backgroundColor = '#ffbc1c'; // Yellow color for rent
        } else {
            placeTitle.textContent = `${place.Type_de_bien || 'Property'}`;
            placeBadge.style.backgroundColor = ''; // Default or no color
        }
    
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