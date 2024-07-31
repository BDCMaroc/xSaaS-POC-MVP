// sidebar.js

function updateSidebar(place) {
    // Get the sidebar elements
    const sidebar = document.getElementById('place-details');
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
    sidebar.style.display = 'block';
}
function updateSidebarforfutureplaces(place) {
    const sidebar = document.getElementById('place-details');
    const placeImage = document.getElementById('place-image');
    const placeDescription = document.getElementById('place-telephone'); // Assuming this is where you want to put the description
    const placePrice = document.getElementById('place-price'); // If you want to put some other info here
    const placeSuperficie = document.getElementById('place-superficie'); // If you want to put some other info here

    // Setting up image URLs
    const imageUrls = [place.pj, place.pj2, place.pj3].filter(url => url && url.trim() !== '');
    let currentImageIndex = 0;

    function showImage(index) {
        if (imageUrls[index]) {
            placeImage.src = `https://www.soliquar.com/Upload/uploads/${imageUrls[index]}`; 
        } else {
            placeImage.src = ''; // Or set a placeholder image if needed
        }
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
    // Show the first image initially if available
    if (imageUrls.length > 0) {
        showImage(currentImageIndex);
    } else {
        placeImage.src = ''; // Or set a placeholder image if needed
    }

    // Show the first image initially
    showImage(currentImageIndex);

    // Update the description
    placeDescription.textContent = `Description: ${place.quoi}`;
    // Optionally clear or update other fields
    placePrice.textContent = '';
    placeSuperficie.textContent = '';

    // Display the sidebar
    sidebar.style.display = 'block';
}