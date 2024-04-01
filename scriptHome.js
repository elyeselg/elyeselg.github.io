// Populate project gallery
const gallery = document.querySelector('.gallery');

const projects = [
    { name: 'Project 1', image: 'project1.jpg' },
    { name: 'Project 2', image: 'project2.jpg' },
    { name: 'Project 3', image: 'project3.jpg' },
    { name: 'Project 4', image: 'project4.jpg' },
    { name: 'Project 5', image: 'project5.jpg' },
    { name: 'Project 6', image: 'project6.jpg' }
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
