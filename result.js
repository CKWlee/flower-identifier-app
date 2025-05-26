// Dark mode toggle
const toggleDarkMode = document.getElementById('toggleDarkMode');
if (toggleDarkMode) {
  toggleDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });
}
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Load and display result
const data = JSON.parse(sessionStorage.getItem('flowerData'));

if (data) {
  document.getElementById('photo').innerHTML = `
    <img src="${data.base64Image}" alt="Uploaded flower">
  `;

  document.getElementById('infoTile').innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Confidence:</strong> ${data.confidence}%</p>
    <p><strong>Origin:</strong> ${data.origin}</p>
    <p>${data.description}</p>
  `;

  const careContent = data.careTips && data.careTips !== 'No care tips available.'
    ? data.careTips
    : 'No care tips available.';

  document.getElementById('careTile').innerHTML = `
    <h3>Care Tips</h3>
    <p>${careContent}</p>
  `;
} else {
  document.body.innerHTML = '<p>❌ No flower data found. Please go back and try again.</p>';
}
