$(document).ready(function() {
    let useFilter = false; // Flag to determine whether to use filtered data or not

    const cities = [
        "Casablanca", "Agadir", "Tanger", "Témara", "Benslimane", "Rabat", "Tangier", "Mohammédia", "Bouskoura", "Tamaris", 
        "Marrakech", "Kénitra", "Salé", "Fès", "Oujda", "Médiouna", "Meknès", "Midelt", "Dar Ben Abdallah Ben Dehbi", 
        "El Jadida", "Al Aaroui", "M'diq", "Safi", "Martil", "Soualem", "Ain Chkef", "Tétouan", "Arrahma", "Essaouira", 
        "Sidi Rahal", "Ben Guerir", "Nouaceur", "Saidia", "Ksar es Seghir", "Madinat Arrahma", "Tiflet", "Ait Melloul", 
        "Settat", "Sidi Slimane Echcharaa", "Berrechid", "Had Soualem", "Oualidia", "Nouasseur", "Bouznika", 
        "Sidi Allal el Bahraoui", "Taza", "Azrou", "Ben Abid", "Tiznit", "Dcheira El Jihadia", "Berrchid", "Cabo Negro", 
        "Guelmim", "Inconnu", "Sidi Ifni", "Sidi Bouzguia", "Dar El Ain", "Ali ou Omar", "Oumnass", "Ben Achir", 
        "Ezzamrani", "Ksar Asrir", "Ait Ouribel", "Sidi Abdallah Ghiat", "Mirleft", "Ourika", "Ait Ouasaksou", "Aghmat", 
        "Amezrou Foukani", "Tiwririne", "Srairi", "Sidi Bennour", "Oulad Ziane", "Commune rurale Ain Johra", 
        "Corniche Aglou", "Souira Guedima", "Ouarzazate", "Sidi Hajjaj", "Khouribga", "Fnideq", "Harhoura", 
        "El Mansouria", "Bouknadel", "Skhirate", "Berkane", "Taroudant", "Imi Ouaddar", "Jerada", "Guercif", 
        "Taourirt", "Nador", "Al Hoceima", "Mehdya", "Beni-Mellal", "Dakhla", "Mliech", "Centre Commune El Menzeh", 
        "Âïn-Harrouda", "Mayate", "Tamesna", "Laayoune", "Chefchaouen", "Oued Laou", "Azemmour", "Ras Kebdana", 
        "Marina Smir", "Ifran", "Inezgane", "Larache", "Gueznaia", "Asilah", "El Kelaa des Sraghna", "Ain El Aouda", 
        "Taghazout-Aourir", "Centre Ait Youssef Ou Ali", "Ben Yakhlef", "Bouyafar", "El Hajeb", "Tit Mellil", 
        "Province of Ouezzane", "Ifrane", "Sidi Boukhalkhal", "Douar chlouh", "Ben Mansour", "El Afak", "Oued Zem", 
        "Nouvelle Lahraouine", "Centre Laouamra", "Tamensourt", "Souihla", "El Ksiba", "Errachidia", 
        "Sidi Saïd Maachou", "Taghazout", "Ikkaouen Abdelghaya Souahel", "Awlad-An-Nama", "Ahfir", "Imilchil", 
        "Douar Tayenza", "Tamri", "Had Draa", "Boujdour", "Ouaourioud", "Deroua", "Ait Ayach", "Kipembawe", "Khémisset", 
        "Kinshasa", "Gouaret Meharza", "Titt Mellilen", "Sidi Bouknadel", "Sidi Yaaqoub", "Douar oulad abdelkader", 
        "Siwana", "Imouzzer Kandar", "Selouane", "El Hajriyine", "Imzouren", "Oulad Berhil", "Siar Boujnahhe", 
        "Aïn Harrouda", "Temsia", "Marsa Ben M'Hidi", "Tagherout", "Tameslohte", "Sidi Kacem", "Moulay Abellah Amghar", 
        "La Nouvelle Ville Ibn Batouta", "Drarga", "Tamallalt", "Oulad Frej", "Tadrart", "Zeghanghane", 
        "Moulay Bousselham", "Centre Commune Foum Oudi", "Chichaoua", "Kasbah de Merchouch", "Moulay Abdallah Amghar", 
        "Ain si Azouz", "Tarmigt", "Ksar El-Kébir", "Village Addeein", "Montgeron", "Amsa", "Ahlaf", 
        "Centre Commune Ouled Zidane", "Karachi", "Gmassa", "Sefrou", "Amtar", "Oukaïmeden", "Mellalyène", 
        "Lalla Takerkoust", "El Gara", "Sidi-Bibi", "Ain Cheggag", "Sidi Amara", "El Azzaba El Koucha", 
        "Dar Dahamna", "Ain Jebbouja Mansouria", "Zemmour Touirza", "Saadat El faid", "Tamraght", "Essehoul", 
        "Oulad Ayad", "Sidi Abed", "Nouaseur", "Ain Tazitounte", "Amizmiz", "Dayedaate", "Bir Jdid", "Skoura", 
        "Houara", "Taounate", "M'Rirt", "Saadla", "Seattle", "Douar Lakhelafna", "Driouch", "Bhalil", 
        "Zemamra", "Loulad", "Oulad Tayeb", "Centre Commune Ouled Ghanem", "Labdahja", "Ait Torkin", "El Beddouza", 
        "Beni Mellal", "sidi mnan", "Khemis Sidi Yahya", "Khénifra", "Ait Ichou", "Sidi Aamara", "Tazroute", 
        "Tarfaya", "Oulad Rahmoune", "Sidi Ali Ben Hamdouche", "El-Aaiún", "Fkih Ben Salah", "Mzala", 
        "Moulay Yacoub Prefecture", "Lqliâa", "Tinghir", "Sidi Bou Othmane", "Ait Said Ou Idder", "Douar Aït Hanncha", 
        "Marrakesh", "Dar-el-Beida", "Sti Fadma", "Ait Faska", "Chtouka", "Souira Kedima"
    ];

    // Step 1: Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get values from URL parameters
    const city = urlParams.get('city') || '';
    const minPrice = urlParams.get('min_price') || '0';
    const maxPrice = urlParams.get('max_price') || '0';
    const minSuperficie = urlParams.get('min_superficie') || '0';
    const maxSuperficie = urlParams.get('max_superficie') || '0';
    const type = urlParams.get('type') || '';

    // Step 2: Set the values of filter fields
    $('#navsearch').val(city);
    $('#min-price').val(minPrice);
    $('#max-price').val(maxPrice);
    $('#min-superficie').val(minSuperficie);
    $('#max-superficie').val(maxSuperficie);
    $('#select-type').val(type);

    // Step 3: Update the filter buttons to reflect the selected values
    updatePriceButton();
    updateSuperficieButton();
    updateTypeButton();

    $('#min-price, #max-price').on('change', updatePriceButton);
    $('#min-superficie, #max-superficie').on('change', updateSuperficieButton);
    $('#select-type').on('change', updateTypeButton);

    function updatePriceButton() {
        const minPricefortext = $('#min-price option:selected').text();
        const maxPricefortext = $('#max-price option:selected').text();
        const priceText = `${minPricefortext} - ${maxPricefortext}`;
        $('#price-filter-btn').html(priceText);
    }

    function updateSuperficieButton() {
        const minSuperficiefortext = $('#min-superficie option:selected').text();
        const maxSuperficiefortext = $('#max-superficie option:selected').text();
        const superficieText = `${minSuperficiefortext} - ${maxSuperficiefortext}`;
        $('#superficie-filter-btn').html(superficieText);
    }

    function updateTypeButton() {
        const typefortext = $('#select-type option:selected').text();
        const typeText = `Type: ${typefortext}`;
        $('#type-filter-btn').html(typeText);
    }

    $('#navsearch').on('input', function() {
        const searchQuery = $(this).val().toLowerCase();
        let filteredCities = cities.filter(city => city.toLowerCase().includes(searchQuery));
        
        if (filteredCities.length > 0) {
            let dropdown = '<ul class="city-list">';
            filteredCities.forEach(function(city) {
                dropdown += `<li class="city-item">${city}</li>`;
            });
            dropdown += '</ul>';
            $('#city-list').html(dropdown);
        } else {
            $('#city-list').html('');
        }
    });

    $(document).on('click', '.city-item', function() {
        const city = $(this).text();
        $('#navsearch').val(city);
        $('#city-list').html('');
    });

    $('#save-search-btn').on('click', function() {
        const minPrice = $('#min-price').val();
        const maxPrice = $('#max-price').val();
        const minSuperficie = $('#min-superficie').val();
        const maxSuperficie = $('#max-superficie').val();
        const typeDeBien = $('#select-type').val();
        
        // Get the city from the search bar or any default city
        const city = $('#navsearch').val() || 'Casablanca';
        
        // Construct the URL with the query parameters
        const queryString = `city=${encodeURIComponent(city)}&min_price=${minPrice}&max_price=${maxPrice}&min_superficie=${minSuperficie}&max_superficie=${maxSuperficie}&type=${encodeURIComponent(typeDeBien)}`;
        
        // Redirect to the places.php page with the filters applied
        window.location.href = `places.php?${queryString}`;
    });
});
