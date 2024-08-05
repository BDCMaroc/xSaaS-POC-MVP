function formatPrice(price) {
    if (price >= 10000) {
        return (price / 10000) + 'M';
    }
    if (price < 10000) {
        return (price) + 'DH';
    }
    return price;
}
