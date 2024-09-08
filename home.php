<!DOCTYPE html>
<html lang="en">

<head> <?php include("header.php") ?> </head>

<body>
    <?php include("navbar.php");
            include 'date_helper.php';
     ?>

    <section class="hero-section">
        <div class="hero-content">
            <h1>The #1 site real estate professionals trust</h1>
            <div class="searchbar">
                <input type="text" id="search" placeholder="Search for a place">
                <div id="city-list" class="dropdown"></div>
                <div class="searchicon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="white" fill-rule="evenodd"
                            d="M16.618 18.032a9 9 0 1 1 1.414-1.414l3.675 3.675a1 1 0 0 1-1.414 1.414l-3.675-3.675ZM18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    </section>
    <section class="browse-section">
        <div class="browse-section-title">
            <div class="p1">
                <h2>Browse homes around 100M</h2>
                <a id="view-more-link" href="places.php?city=Casablanca" style="color: gray;">View more houses in
                    Casablanca
                </a>
            </div>
            <a href="maps.php" class="p2" style="text-decoration: none;">
                <button class="btn">
                    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" id="Layer_1"
                        class="sparkle" viewBox="0 0 576 512">
                        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path
                            d="M302.8 312C334.9 271.9 408 174.6 408 120C408 53.7 354.3 0 288 0S168 53.7 168 120c0 54.6 73.1 151.9 105.2 192c7.7 9.6 22 9.6 29.6 0zM416 503l144.9-58c9.1-3.6 15.1-12.5 15.1-22.3L576 152c0-17-17.1-28.6-32.9-22.3l-116 46.4c-.5 1.2-1 2.5-1.5 3.7c-2.9 6.8-6.1 13.7-9.6 20.6L416 503zM15.1 187.3C6 191 0 199.8 0 209.6L0 480.4c0 17 17.1 28.6 32.9 22.3L160 451.8l0-251.4c-3.5-6.9-6.7-13.8-9.6-20.6c-5.6-13.2-10.4-27.4-12.8-41.5l-122.6 49zM384 255c-20.5 31.3-42.3 59.6-56.2 77c-20.5 25.6-59.1 25.6-79.6 0c-13.9-17.4-35.7-45.7-56.2-77l0 194.4 192 54.9L384 255z" />
                    </svg>

                    <span class="text">View on map</span>
                </button>
            </a>
        </div>
        <div class=" browse-cards">
            <?php include("fetch_places.php"); ?>
        </div>
    </section>

    <script src="fetchBySearchBar.js"></script>
</body>

</html>