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

$(document).ready(function() {
    $('#search').on('input', function() {
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

    // Handle selecting a city from the list
    $(document).on('click', '.city-item', function() {
        const city = $(this).text();
        $('#search').val(city);
        $('#city-list').html('');
        fetchPlaces(city);

        // Store the city in localStorage
        localStorage.setItem('selectedCity', city);

        // Update the "View on map" link
        $('.p2 .btn').attr('data-city', city); // Storing city data in button for later use
    });

    // Handle search by pressing Enter or clicking on the search icon
    $('#search').on('keypress', function(e) {
        if (e.which == 13) {
            e.preventDefault();
            const city = $(this).val();
            fetchPlaces(city);
            $('#city-list').html('');

            // Store the city in localStorage
            localStorage.setItem('selectedCity', city);

            // Update the "View on map" link
            $('.p2 .btn').attr('data-city', city);
        }
    });

    $('.searchicon').on('click', function() {
        const city = $('#search').val();
        fetchPlaces(city);

        // Store the city in localStorage
        localStorage.setItem('selectedCity', city);
        
        // Update the "View on map" link
        $('.p2 .btn').attr('data-city', city);
    });

    $('.p2 .btn').on('click', function() {
        const city = $(this).attr('data-city') || 'Casablanca'; // Default to Casablanca if no city selected
        window.location.href = `maps.html?city=${city}`;
    });
});

function fetchPlaces(city) {
    // Update the "View more houses in" link
    $('#view-more-link').attr('href', `places.php?city=${city}`);
    $('#view-more-link').text(`View more houses in ${city}`);

    $.ajax({
        url: 'fetch_places.php',
        method: 'GET',
        data: { city: city },
        success: function(data) {
            $('.browse-cards').html(data);
        }
    });
}