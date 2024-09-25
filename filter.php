<div class="navbaritems">
    <div class="navsearchbar">
    <input type="text" id="navsearch" placeholder="Search for a place" value="<?php echo isset($_GET['city']) ? htmlspecialchars($_GET['city']) : ''; ?>">
    <div id="city-list" class="dropdown"></div> <!-- Add this dropdown container -->
    <div class="searchicon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="white" fill-rule="evenodd"
                    d="M16.618 18.032a9 9 0 1 1 1.414-1.414l3.675 3.675a1 1 0 0 1-1.414 1.414l-3.675-3.675ZM18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    clip-rule="evenodd" />
            </svg>
        </div>
    </div>
    <div class="filter">
        <div class="filter-p1">
        <div class="price-item">
            <button class="filter-button" id="price-filter-btn">Price <i class="fa-solid fa-chevron-down"></i></button>
            <div id="price-dropdown" style="top : 60px" class="dropdown-price">
            <div class="input-price-section">
                <select id="min-price">
                    <option value="0">No min</option>
                    <option value="1000">$1K</option>
                    <option value="4000">$4K</option>
                    <option value="50000">$50K</option>
                    <option value="1000000">$100M</option>
                    <option value="2000000">$200M</option>
                    <option value="4000000">$400M</option>
                    <option value="10000000">$1B</option>
                </select>
                <i class="fa-solid fa-minus"></i>
                <select id="max-price">
                    <option value="0">No min</option>
                    <option value="1000">$1K</option>
                    <option value="4000">$4K</option>
                    <option value="50000">$50K</option>
                    <option value="1000000">$100M</option>
                    <option value="2000000">$200M</option>
                    <option value="4000000">$400M</option>
                    <option value="10000000">$1B</option>
                </select>
            </div>
        </div>
        </div>
        
        <div class="superficie-item">
            <button class="filter-button" id="superficie-filter-btn">superficie<i
                    class="fa-solid fa-chevron-down"></i></button>
                    <div id="superficie-dropdown" style="top : 60px" class="dropdown-superficie">
            <div class="input-superficie-section">
                <select id="min-superficie">
                    <option value="0">No min</option>
                    <option value="50">50 M2</option>
                    <option value="100">100 M2</option>
                    <option value="150">150 M2</option>
                    <option value="200">200 M2</option>
                    <option value="300">300 M2</option>
                    <option value="500">500 M2</option>
                    <option value="100000">Max M2</option>
                </select>
                <i class="fa-solid fa-minus"></i>
                <select id="max-superficie">
                    <option value="0">No min</option>
                    <option value="50">50 M2</option>
                    <option value="100">100 M2</option>
                    <option value="150">150 M2</option>
                    <option value="200">200 M2</option>
                    <option value="300">300 M2</option>
                    <option value="500">500 M2</option>
                    <option value="100000">Max M2</option>
                </select>
            </div>
        </div>
        </div>
        
        <div class="type-item">
            <button class="filter-button" id="type-filter-btn">Type<i class="fa-solid fa-chevron-down"></i></button>
            <div id="type-dropdown" style="top : 60px" class="dropdown-type">
            <div class="input-type-section">
                <select style="width: 100%;" id="select-type">
                    <option value="">ALL</option>
                    <option value="Appartement">Appartement </option>
                    <option value="Terrain pour villa">Terrain pour villa</option>
                    <option value="Duplex">Duplex </option>
                    <option value="Studio">Studio </option>
                    <option value="Villa">Villa </option>
                    <option value="Bungalow">Bungalow </option>
                    <option value="Bureau">Bureau </option>
                    <option value="Chambre">Chambre </option>
                    <option value="Ferme">Ferme </option>
                    <option value="Immeuble">Immeuble </option>
                    <option value="Inconnu">Inconnu </option>
                    <option value="Local commercial">Local commercial </option>
                    <option value="Lot de villa">Lot de villa </option>
                    <option value="Lot">Lot </option>
                    <option value="Lot de terrain">Lot de terrain </option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Maison">Maison</option>
                    <option value="Riad">Riad</option>
                    <option value="Terrain">Terrain</option>
                    <option value="Triplex">Triplex</option>
                </select>
            </div>
        </div>
        </div>
        
        <div class="items-navbar">
            <button class="filter-button" id="save-search-btn">Save Search</button>
        </div>
</div>
<div class="filter-p2">
<div class="map-list-btns">
    
        <button class="list">List</button>
        <a href="maps.php?city=<?= $city; ?>&min_price=<?= $min_price; ?>&max_price=<?= $max_price; ?>&min_superficie=<?= $min_superficie; ?>&max_superficie=<?= $max_superficie; ?>&type=<?= $type; ?>" >
            <button class="map">Map</button>
        </a>
    </div>
    </div>

    </div>

</div>
<script>
    document.getElementById('min-price').addEventListener('change', function() {
    let minPrice = parseInt(this.value);
    let maxPrice = parseInt(document.getElementById('max-price').value);

    // Check if the min price is greater than or equal to the max price
    if (minPrice >= maxPrice && maxPrice !== 0) {
        // Update the max price to a value higher than min price
        let newMaxOption = Array.from(this.options).find(option => parseInt(option.value) > minPrice);
        if (newMaxOption) {
            document.getElementById('max-price').value = newMaxOption.value;
        } else {
            document.getElementById('max-price').value = 0; // Set to 'No min' if no valid option is found
        }
    }
});

document.getElementById('max-price').addEventListener('change', function() {
    let maxPrice = parseInt(this.value);
    let minPrice = parseInt(document.getElementById('min-price').value);

    // Check if the max price is less than or equal to the min price
    if (maxPrice <= minPrice && maxPrice !== 0) {
        // Update the min price to a value lower than max price
        let newMinOption = Array.from(this.options).find(option => parseInt(option.value) < maxPrice);
        if (newMinOption) {
            document.getElementById('min-price').value = newMinOption.value;
        } else {
            document.getElementById('min-price').value = 0; // Set to 'No min' if no valid option is found
        }
    }
});

document.getElementById('min-superficie').addEventListener('change', function() {
    let minSuperficie = parseInt(this.value);
    let maxSuperficie = parseInt(document.getElementById('max-superficie').value);

    // Check if the min superficie is greater than or equal to the max superficie
    if (minSuperficie >= maxSuperficie && maxSuperficie !== 0) {
        // Update the max superficie to a value higher than min superficie
        let newMaxOption = Array.from(this.options).find(option => parseInt(option.value) > minSuperficie);
        if (newMaxOption) {
            document.getElementById('max-superficie').value = newMaxOption.value;
        } else {
            document.getElementById('max-superficie').value = 0; // Set to 'No min' if no valid option is found
        }
    }
});

document.getElementById('max-superficie').addEventListener('change', function() {
    let maxSuperficie = parseInt(this.value);
    let minSuperficie = parseInt(document.getElementById('min-superficie').value);

    // Check if the max superficie is less than or equal to the min superficie
    if (maxSuperficie <= minSuperficie && maxSuperficie !== 0) {
        // Update the min superficie to a value lower than max superficie
        let newMinOption = Array.from(this.options).find(option => parseInt(option.value) < maxSuperficie);
        if (newMinOption) {
            document.getElementById('min-superficie').value = newMinOption.value;
        } else {
            document.getElementById('min-superficie').value = 0; // Set to 'No min' if no valid option is found
        }
    }
});


</script>

