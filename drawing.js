function drawCircle() {
    clearSelectedShape();
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
    google.maps.event.addListenerOnce(drawingManager, 'circlecomplete', function(circ) {
        circle = circ;
        google.maps.event.addListener(circle, 'radius_changed', function() {
            fetchLocalDataInCircle(circle);
        });
        google.maps.event.addListener(circle, 'center_changed', function() {
            fetchLocalDataInCircle(circle);
        });
        fetchLocalDataInCircle(circle);
    });
}

function drawPolygon() {
    clearSelectedShape();
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    google.maps.event.addListenerOnce(drawingManager, 'polygoncomplete', function(poly) {
        selectedShape = poly;
        google.maps.event.addListener(selectedShape.getPath(), 'set_at', function() {
            fetchLocalDataInPolygon(selectedShape);
        });
        google.maps.event.addListener(selectedShape.getPath(), 'insert_at', function() {
            fetchLocalDataInPolygon(selectedShape);
        });
        fetchLocalDataInPolygon(selectedShape);
    });
}

function clearSelectedShape() {
    if (selectedShape) {
        selectedShape.setMap(null);
        selectedShape = null;
    }
    if (circle) {
        circle.setMap(null);
        circle = null;
    }
    drawingManager.setDrawingMode(null);
}
