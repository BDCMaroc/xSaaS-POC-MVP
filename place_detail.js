function updatePlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    const placeImage = document.getElementById('place-image');
    const placeTelephone = document.getElementById('place-telephone');
    const placePrice = document.getElementById('place-price');
    const placeSuperficie = document.getElementById('place-superficie');
    
    // Assuming place.Images_url is a comma-separated string of image URLs
    const imageUrls = place.Images_url.split(',').map(url => url.trim());
    
    let currentImageIndex = 0;
    
    function showImage(index) {
        placeImage.src = imageUrls[index];
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
    
    // Update the image, telephone, price, and superficie
    showImage(currentImageIndex);
    placeTelephone.textContent = `Telephone: ${place.Telephone || 'N/A'}`;
    placePrice.textContent = `Price: ${place.Prix} DH`;
    placeSuperficie.textContent = `Superficie: ${place.Superficie}`;
    
    // Display the place-details section
    placeDetails.style.display = 'block';
}