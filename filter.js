

function resetFilters() {
$('#min-price').val('');
$('#max-price').val('');
$('#min-superficie').val('');
$('#max-superficie').val('');
fetchLocalData(map.getBounds());
}

function fetchFilteredData() {
const minPrice = $('#min-price').val();
const maxPrice = $('#max-price').val();
const minSuperficie = $('#min-superficie').val();
const maxSuperficie = $('#max-superficie').val();
const bounds = map.getBounds();

const params = {
    lat_min: bounds.getSouthWest().lat(),
    lat_max: bounds.getNorthEast().lat(),
    lng_min: bounds.getSouthWest().lng(),
    lng_max: bounds.getNorthEast().lng()
};

if (minPrice) params.minPrice = minPrice;
if (maxPrice) params.maxPrice = maxPrice;
if (minSuperficie) params.minSuperficie = minSuperficie;
if (maxSuperficie) params.maxSuperficie = maxSuperficie;

fetchLocalData(params);
}