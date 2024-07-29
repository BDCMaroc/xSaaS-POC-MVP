<?php
include 'connexion.php';

// Fetch the new default marker
$sql = "SELECT lat, lng FROM markers WHERE type = 'default' LIMIT 1";
$result = $conn->query($sql);

$defaultLocation = $result->fetch_assoc();

$conn->close();

echo json_encode($defaultLocation);
?>
