<?php
include("connexion.php");
 
 $sql = "SELECT id, name, lat, lng FROM markers";
 $result = $conn->query($sql);
 
 $places = array();
 if ($result->num_rows > 0) {
     while($row = $result->fetch_assoc()) {
         $places[] = $row;
     }
 }

$conn->close();
echo json_encode($places);
?>
 