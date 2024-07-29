
let currentOpenInfoWindow = null; // To keep track of the currently open info window

// Define the TextMarker function constructor with structured handling for both price and superficie
function TextMarker(options) {
    this.position = options.position; // Google Maps LatLng object
    this.map = options.map; // Google Maps map object where the marker will be placed
    this.priceText = formatPrice(options.price); // Process the price through a formatting function
    this.superficieText = options.superficie + ' M'; // Append 'sqm' to the superficie data
    this.fullPrice = options.price;
    this.oneimage = options.imageUrl.split(',')[0];
    this.imageUrls = options.imageUrl;
    this.telephone = options.telephone;
    this.div = null; // DOM element for the marker, initialized as null
    this.infoWindowDiv = null;  // Store the info window div
    this.setMap(options.map); // Calls the setMap method of the OverlayView to associate the map
}

// Inherit from Google Maps OverlayView
TextMarker.prototype = new google.maps.OverlayView();

// Defines what happens when the TextMarker is added to the map
TextMarker.prototype.onAdd = function() {
    const div = document.createElement('div');
    div.className = 'text-marker'; // Apply a predefined CSS class for styles
    div.innerHTML = '<div class="superficie">' + this.superficieText + '</div><div class="price">' + this.priceText + '</div>'; // Set the inner HTML to show both price and superficie

    this.div = div; // Store the div element in the instance variable
    const panes = this.getPanes(); // Fetch the panes where overlays are displayed on the map
    panes.overlayImage.appendChild(div); // Add the div to the overlayImage pane
    
    div.addEventListener('click', () => {
        this.showInfoWindow();
        displayPlaceDetails({
            telephone: this.telephone,
            price: this.fullPrice,
            superficie: this.superficieText,
            imageUrls: this.imageUrls
        });
    });
};

// Defines how to draw the marker on the map
TextMarker.prototype.draw = function() {
    const overlayProjection = this.getProjection(); // Get the projection to convert between LatLng and pixel coordinates
    const position = overlayProjection.fromLatLngToDivPixel(this.position); // Convert the LatLng to pixel coordinates

    const div = this.div;  // Fetch the div element
    const divWidth = 100;  // Adjust according to your marker's width
    const divHeight = div.offsetHeight;  // Get the height of the marker element

    div.style.left = (position.x - divWidth / 2) + 'px';  // Position horizontally, centered
    div.style.top = (position.y - divHeight) + 'px';  // Position vertically, aligned with the bottom of the triangle

    if (this.infoWindowDiv) {
        this.infoWindowDiv.style.left = (position.x - 100) + 'px';  // Center the info window horizontally
        this.infoWindowDiv.style.top = (position.y - divHeight - 110) + 'px';  // Position above the marker
    }
};

// Defines the cleanup logic when the TextMarker is removed from the map
TextMarker.prototype.onRemove = function() {
    if (this.div) {
        this.div.parentNode.removeChild(this.div); // Remove the div from the DOM
        this.div = null; // Clear the reference to the div
    }
    if (this.infoWindowDiv) {
        this.infoWindowDiv.parentNode.removeChild(this.infoWindowDiv);  // Remove the info window from the DOM
        this.infoWindowDiv = null;  // Clear the reference to the info window div
    }
};

TextMarker.prototype.showInfoWindow = function() {
    if (currentOpenInfoWindow && currentOpenInfoWindow !== this) {
        currentOpenInfoWindow.closeInfoWindow();
    }
    
    
    if (this.infoWindowDiv) {
        // If the info window already exists, remove it
        this.closeInfoWindow();
        currentOpenInfoWindow = null;
    }else {

    // Create the info window div
    const infoWindowDiv = document.createElement('div');
    infoWindowDiv.className = 'info-window';  // Apply the CSS class for styles
    infoWindowDiv.innerHTML = `
        <button>NEW</button>
        <div class="info-details" >
            <p><strong>Price :</strong> ${this.fullPrice} DH</p>
            <p><strong>Superficie :</strong> ${this.superficieText} </p>
        </div>
    `;
    infoWindowDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(0, 0, 0, 0.5)), url(${this.oneimage})`;  // Set the background image with gradient

    this.infoWindowDiv = infoWindowDiv;
    const panes = this.getPanes();  // Fetch the panes where overlays are displayed on the map
    panes.overlayImage.appendChild(infoWindowDiv);  // Add the info window div to the overlayImage pane

    this.draw();  // Re-draw the marker to position the info window correctly
    currentOpenInfoWindow = this;
    }
};
TextMarker.prototype.closeInfoWindow = function() {
    if (this.infoWindowDiv) {
        this.infoWindowDiv.parentNode.removeChild(this.infoWindowDiv);  // Remove the info window from the DOM
        this.infoWindowDiv = null;  // Clear the reference to the info window div
    }
};
// Ensure your CSS class for text-marker is defined in your stylesheet to apply the intended styles
