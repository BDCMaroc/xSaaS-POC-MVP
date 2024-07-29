function formatPrice(price) {
    if (price >= 10000) {
        return (price / 10000) + 'M DH';
    }
    return price;
}
