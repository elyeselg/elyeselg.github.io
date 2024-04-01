// Sélectionne tous les liens de la barre de navigation
const navLinks = document.querySelectorAll('nav ul li a');

// Ajoute un gestionnaire d'événements à chaque lien
navLinks.forEach(link => {
    link.addEventListener('mouseover', addHoverEffect);
    link.addEventListener('mouseout', removeHoverEffect);
});

// Fonction pour ajouter l'effet de survol
function addHoverEffect() {
    this.style.color = '#ffcc00'; // Changement de couleur au survol
}

// Fonction pour supprimer l'effet de survol
function removeHoverEffect() {
    this.style.color = '#ffffff'; // Restauration de la couleur d'origine
}


// Sélectionne le lien de téléchargement du CV
const downloadLink = document.querySelector('a[href="votre-cv.pdf"]');

// Ajoute un effet de survol au lien de téléchargement
downloadLink.addEventListener('mouseover', addHoverEffect);
downloadLink.addEventListener('mouseout', removeHoverEffect);

// Fonction pour ajouter l'effet de survol
function addHoverEffect() {
    this.style.backgroundColor = '#ffcc00'; // Changement de couleur de fond au survol
    this.style.color = '#fff'; // Changement de couleur du texte au survol
}

// Fonction pour supprimer l'effet de survol
function removeHoverEffect() {
    this.style.backgroundColor = ''; // Retour à la couleur de fond d'origine
    this.style.color = ''; // Retour à la couleur du texte d'origine
}

// Fonction pour défilement fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});
