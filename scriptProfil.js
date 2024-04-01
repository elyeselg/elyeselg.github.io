document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');

    // Fonction pour ajouter des classes d'animation
    function revealSection() {
        sections.forEach(section => {
            const sectionPosition = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionPosition < windowHeight / 1.2) {
                section.classList.add('revealed');
            } else {
                section.classList.remove('revealed');
            }
        });
    }

    // Appel de la fonction au chargement de la page et au défilement
    revealSection();
    window.addEventListener('scroll', revealSection);
});
