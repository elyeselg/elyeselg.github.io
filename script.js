// Sélectionne tous les liens de la barre de navigation
const navLinks = document.querySelectorAll('nav ul li a');

// Ajoute un gestionnaire d'événements à chaque lien
navLinks.forEach(link => {
    link.addEventListener('click', smoothScroll);
});

// Fonction pour le défilement fluide
function smoothScroll(event) {
    event.preventDefault();
    const targetId = this.getAttribute('href');
    const targetPosition = document.querySelector(targetId).offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000; // Durée de l'animation en millisecondes
    let start = null;

    // Fonction d'animation
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Fonction pour courbe d'accélération (ease)
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}
// Sélectionne tous les éléments avec la classe "project"
const projects = document.querySelectorAll('.project');

// Ajoute un gestionnaire d'événements à chaque projet
projects.forEach(project => {
    project.addEventListener('mouseenter', addHoverEffect);
    project.addEventListener('mouseleave', removeHoverEffect);
});

// Fonction pour ajouter l'effet de survol
function addHoverEffect() {
    this.style.transform = 'scale(1.05)'; /* Augmente la taille du projet au survol */
    this.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)'; /* Ajoute une ombre plus prononcée */
}

// Fonction pour supprimer l'effet de survol
function removeHoverEffect() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
}
