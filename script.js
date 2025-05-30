const backendUrl = 'https://flower-backend-cyan.vercel.app/api/identify';
const identifyButton = document.getElementById('identifyButton');
const imageInput = document.getElementById('imageInput');
const loadingDiv = document.getElementById('loading');

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

identifyButton.addEventListener('click', async () => {
  const file = imageInput.files[0];
  if (!file) {
    alert('Please select an image first.');
    return;
  }

  loadingDiv.style.display = 'block';

  const reader = new FileReader();
  reader.onloadend = async () => {
    const fullBase64Image = reader.result;
    const base64Image = reader.result.split(',')[1];

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();
      loadingDiv.style.display = 'none';
      handleResult(data, fullBase64Image);
    } catch (error) {
      console.error(error);
      loadingDiv.innerHTML = '❌ Error identifying the flower. Please try again.';
    }
  };

  reader.readAsDataURL(file);
});

function handleResult(data, fullBase64Image) {
  if (data.suggestions && data.suggestions.length > 0) {
    const plant = data.suggestions[0];
    const name = plant.plant_name;
    const confidence = (plant.probability * 100).toFixed(2);
    const description = plant.plant_details?.wiki_description?.value || 'No description available.';

    let origin = 'Unknown origin';
    if (plant.plant_details?.distribution?.length) {
      origin = plant.plant_details.distribution.join(', ');
    } else {
      const nativeMatch = description.match(/native to ([^.,]+)/i);
      if (nativeMatch) {
        origin = nativeMatch[1].trim().replace(/\b\w/g, c => c.toUpperCase());
      }
    }

    let careTips = 'No care tips available.';
    if (plant.plant_details?.care_guides?.length) {
      careTips = plant.plant_details.care_guides
        .filter(guide => guide.content)
        .map(guide => `<strong>${guide.title}:</strong> ${guide.content}`)
        .join('<br><br>');
    }

    sessionStorage.setItem('flowerData', JSON.stringify({
      name, confidence, origin, description, careTips, base64Image: fullBase64Image
    }));

    window.location.href = 'result.html';
  } else {
    loadingDiv.innerHTML = '❌ Could not identify the plant. Please try another photo.';
  }
}
