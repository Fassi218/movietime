        // Functie voor het openen en sluiten van het hamburger menu
        function toggleMenu() {
            const nav = document.querySelector('.nav');
            nav.classList.toggle('active');
        }

        // Functie voor het filteren van films op basis van zoekopdracht
        function filterFilms() {
            const searchQuery = document.getElementById('searchBox').value.toLowerCase();
            const films = document.querySelectorAll('.film');

            films.forEach(film => {
                const title = film.getAttribute('data-title').toLowerCase();
                if (title.includes(searchQuery)) {
                    film.style.display = 'flex';
                } else {
                    film.style.display = 'none';
                }
            });
        }

        // Functie voor het openen van de lightbox met een grotere afbeelding
        function openLightbox(image) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightboxImage');
            lightboxImage.src = image;
            lightbox.style.display = 'flex';
            
            // Voorkom dat de klik op de afbeelding de lightbox sluit
            event.stopPropagation();
        }

        // Functie voor het sluiten van de lightbox
        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.style.display = 'none';
        }

        // Event listener om de Escape-toets te gebruiken om de lightbox te sluiten
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeLightbox();
            }
        });

        // Functie voor het openen en sluiten van het hamburger menu
        function toggleMenu() {
            const nav = document.querySelector('.nav');
            nav.classList.toggle('active'); 
        }        

                // Houdt het aantal recensies bij
        let reviewCount = 0;
        
        // Houdt de huidige geselecteerde filmrating bij
        let currentRating = 0;
    
        // Opslag voor recensies per locatie
        const locationReviews = {
            Amsterdam: [],
            Rotterdam: [],
            Utrecht: [],
            "Den Haag": [],
            Eindhoven: []
        };
    
        // Opslag voor films per locatie
        const locationMovies = {
            Amsterdam: ["Inception", "The Dark Knight", "Interstellar", "Dune", "No Time To Die", "Spider-Man: No Way Home"],
            Rotterdam: ["Avatar", "The Avengers", "Jurassic World", "Star Wars", "The Lion King", "Titanic"],
            Utrecht: ["The Matrix", "Pulp Fiction", "The Godfather", "Forrest Gump", "The Shawshank Redemption", "Fight Club"],
            "Den Haag": ["Jaws", "Parasite", "Joker", "Blade Runner", "Goodfellas", "The Silence of the Lambs"],
            Eindhoven: ["The Lord of the Rings", "The Hobbit", "Harry Potter", "Pirates of the Caribbean", "Indiana Jones", "Back to the Future"]
        };
    
        // Houdt bij welke locatie momenteel is geselecteerd
        let currentLocation = 'Amsterdam';
    
        // Stelt de beoordeling (sterren) in voor een film
        function setRating(movieTitle, rating) {
            // Sla de rating op voor later gebruik
            currentRating = rating;
            
            // Selecteer de sterren binnen de corresponderende filmkaart
            const stars = document.querySelectorAll(`.movie-card[data-title="${movieTitle}"] .rating span`);
            
            // Kleur de sterren tot aan de gekozen beoordeling in
            stars.forEach((star, index) => {
                star.style.color = index < rating ? '#f39c12' : '#ccc';
            });
            
            return rating;
        }
    
        // Voeg een recensie toe voor een film
        function addReview(title, rating) {
            // Haal de recensie tekst op
            const reviewText = document.getElementById(`review-text-${title}`).value;
    
            // Controleer of er zowel een recensie als een beoordeling is ingevuld
            if (!reviewText || rating === 0) {
                alert('Geef een sterbeoordeling en schrijf een recensie!');
                return;
            }
    
            // Maak een recensie-object
            const review = {
                title: title,
                rating: rating,
                text: reviewText,
                date: new Date().toLocaleDateString('nl-NL')
            };
    
            // Voeg de recensie toe aan de huidige locatie
            locationReviews[currentLocation].push(review);
    
            // Houd maximaal 3 recensies per locatie bij
            if (locationReviews[currentLocation].length > 3) {
                locationReviews[currentLocation].shift();
            }
    
            // Reset de invoervelden
            document.getElementById(`review-text-${title}`).value = '';
            currentRating = 0;
            setRating(title, 0);
    
            // Update de recensieweergave
            displayReviews();
    
            // Werk de recensie teller bij
            updateReviewCount();
            
            // Toon een bevestigingsbericht
            alert('Bedankt voor je recensie!');
        }
    
        // Toon alle recensies voor de huidige locatie
        function displayReviews() {
            const reviewsContainer = document.getElementById('reviews-container');
            reviewsContainer.innerHTML = ''; // Verwijder oude recensies
    
            // Als er geen recensies zijn, toon een bericht
            if (locationReviews[currentLocation].length === 0) {
                const noReviewsMsg = document.createElement('p');
                noReviewsMsg.textContent = 'Je hebt nog geen recensies geplaatst voor deze vestiging.';
                noReviewsMsg.style.fontStyle = 'italic';
                noReviewsMsg.style.color = '#888';
                reviewsContainer.appendChild(noReviewsMsg);
                return;
            }
    
            // Voeg elke recensie als een kaart toe
            locationReviews[currentLocation].forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.classList.add('review-card');
                
                // Maak sterrenweergave
                const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
                
                reviewCard.innerHTML = `
                    <p class="title">${review.title}</p>
                    <div class="rating">${stars}</div>
                    <p>${review.text}</p>
                    <small class="text-muted">Geplaatst op: ${review.date}</small>
                `;
                reviewsContainer.appendChild(reviewCard);
            });
        }
    
        // Laad data voor de geselecteerde locatie
        function loadLocation() {
            currentLocation = document.getElementById('location-select').value; // Stel de locatie in
            displayReviews(); // Toon recensies
            displayMovies(); // Toon films
            updateReviewCount(); // Update recensie teller
        }
    
        // Genereer een willekeurige kortingscode
        function generateDiscountCode() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = 'MOVIE';
            for (let i = 0; i < 4; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return code;
        }

        // Update de recensieteller en toon korting indien van toepassing
        function updateReviewCount() {
            reviewCount = locationReviews[currentLocation].length;
            document.getElementById('review-count').textContent = `Aantal recensies: ${reviewCount}`;

            // Als er 3 of meer recensies zijn, toon de korting
            if (reviewCount >= 3) {
                document.getElementById('discount').style.display = 'block';
                document.getElementById('discount-code').style.display = 'block';
                document.getElementById('discount-code').innerHTML = `Kortingscode: <strong>${generateDiscountCode()}</strong>`;
            } else {
                document.getElementById('discount').style.display = 'none';
                document.getElementById('discount-code').style.display = 'none';
            }
        }
    
        // Toon alle films voor de huidige locatie
        function displayMovies() {
            const moviesContainer = document.getElementById('movies-container');
            moviesContainer.innerHTML = ''; // Verwijder oude inhoud
    
            // Voeg elke film als een kaart toe
            locationMovies[currentLocation].forEach(movieTitle => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.setAttribute('data-title', movieTitle);
                
                movieCard.innerHTML = `
                    <p class="title">${movieTitle}</p>
                    <p>Wat vind je van deze film?</p>
                    <div class="rating">
                        <span onclick="setRating('${movieTitle}', 1)">★</span>
                        <span onclick="setRating('${movieTitle}', 2)">★</span>
                        <span onclick="setRating('${movieTitle}', 3)">★</span>
                        <span onclick="setRating('${movieTitle}', 4)">★</span>
                        <span onclick="setRating('${movieTitle}', 5)">★</span>
                    </div>
                    <textarea id="review-text-${movieTitle}" class="form-control mb-2" placeholder="Schrijf een recensie..."></textarea>
                    <button class="btn btn-primary" onclick="addReview('${movieTitle}', currentRating)">
                        <i class="fas fa-paper-plane"></i> Verstuur
                    </button>
                `;
                moviesContainer.appendChild(movieCard);
                
                // Reset de rating UI
                setRating(movieTitle, 0);
            });
        }
    
        // Zet het menu aan of uit
        function toggleMenu() {
            const nav = document.querySelector('.nav');
            nav.classList.toggle('active'); 
        }
    
        // Laad standaard de eerste locatie bij het laden van de pagina
        document.addEventListener('DOMContentLoaded', function() {
            loadLocation();
        });

                // Functie om het menu te tonen of te verbergen
        function toggleMenu() {
            const nav = document.querySelector('.nav');
            nav.classList.toggle('active');
        }

        // Functie om locaties te filteren op basis van zoekopdracht
        function filterLocations() {
            const searchInput = document.getElementById("search").value.toLowerCase();
            const locationCards = document.getElementsByClassName("contact-card");

            // Doorloop de locatiekaarten
            for (let i = 0; i < locationCards.length; i++) {
                const card = locationCards[i];
                const textContent = card.textContent || card.innerText;

                // Als de zoekterm voorkomt in de tekst, toon de kaart, anders verberg deze
                if (textContent.toLowerCase().includes(searchInput)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            }
        }