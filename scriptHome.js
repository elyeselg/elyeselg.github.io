// Populate project gallery
const gallery = document.querySelector('.gallery');

const projects = [
    { name: 'Automata Project', image: 'automate_cellulaire.png' },
    { name: 'Encryption', image: 'AES.png' },
    { name: 'NEOS', image: 'logo_clair.png' },
    { name: 'IA Translate', image: 'translate.png' },
    { name: 'IA game Guess who', image: 'project5.jpg' },
    { name: 'Task manager', image: 'task.jpg' }
];

projects.forEach(project => {
    const projectHTML = `
        <div class="gallery-item">
            <img src="${project.image}" alt="${project.name}">
            <h3>${project.name}</h3>
        </div>
    `;
    gallery.innerHTML += projectHTML;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        const offset = 80; // Ajustez la valeur d'offset comme souhaité pour compenser la hauteur du header
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});
