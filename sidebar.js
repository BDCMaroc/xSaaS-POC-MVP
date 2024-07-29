document.addEventListener('DOMContentLoaded', function() {
    let currentImageIndex = 0;
    let currentImageUrls = [];

    function displayPlaceDetails(place) {
        document.getElementById('place-telephone').innerHTML = `<i class="fa-solid fa-phone"></i> Telephone: ${place.telephone}`;
        document.getElementById('place-price').innerHTML = `<i class="fa-solid fa-dollar-sign"></i> Price: ${place.price} DH`;
        document.getElementById('place-superficie').innerHTML = `<i class="fa-solid fa-expand"></i> Superficie: ${place.superficie}`;

 
        currentImageUrls = place.imageUrls.split(',').map(url => url.trim());
        currentImageIndex = 0;
        document.getElementById('place-image').src = currentImageUrls[currentImageIndex];
        
        document.getElementById('place-details').style.display = 'block';
    }

    document.getElementById('prev-image').addEventListener('click', () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            document.getElementById('place-image').src = currentImageUrls[currentImageIndex];
        }
    });

    document.getElementById('next-image').addEventListener('click', () => {
        if (currentImageIndex < currentImageUrls.length - 1) {
            currentImageIndex++;
            document.getElementById('place-image').src = currentImageUrls[currentImageIndex];
        }
    });

    // Export the displayPlaceDetails function so it can be used in other scripts
    window.displayPlaceDetails = displayPlaceDetails;
});
