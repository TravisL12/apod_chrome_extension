/*
mars cameras
FHAZ Front Hazard Avoidance Camera
RHAZ Rear Hazard Avoidance Camera
MAST Mast Camera
CHEMCAM Chemistry and Camera Complex
MAHLI Mars Hand Lens Imager
MARDI Mars Descent Imager
NAVCAM Navigation Camera
PANCAM Panoramic Camera
MINITES Miniature Thermal Emission Spectrometer (Mini-TES)
*/

(function () {
  const root = document.getElementById('root');
  const APOD_API_URL = 'https://api.nasa.gov';
  const APOD_PATH = '/planetary/apod';
  const MARS_PATH = '/mars-photos/api/v1/rovers/curiosity/photos';
  const API_KEY = 'hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447';

  async function fetchMars() {
    const marsUrl = `${APOD_API_URL}${MARS_PATH}?sol=1000&camera=MAST&api_key=${API_KEY}`;
    const resp = await fetch(marsUrl);
    const data = await resp.json();
    generateMarsPage(data.photos.slice(0, 100));
  }

  async function fetchApod() {
    const params = new URLSearchParams(location.search);
    const date = params.get('date');
    if (!date) {
      console.log('NO DATE!');
      return;
    }

    const apodUrl = `${APOD_API_URL}${APOD_PATH}?api_key=${API_KEY}&date=${date}`;
    const resp = await fetch(apodUrl);
    const data = await resp.json();
    generatePage(data);
  }

  function generatePage(data) {
    const img = new Image();
    img.src = data.url;
    root.innerHTML = `
      <h1>${data.title}</h1>
    `;
    root.append(img);
  }

  function generateMarsPage(photos) {
    const pics = photos
      .map(({ img_src }) => {
        return `<div class="marsImg"><img src='${img_src}' /></div>`;
      })
      .join('');

    root.innerHTML = `<div class="mars-container">${pics}</div>`;
  }

  fetchApod();
  // fetchMars();
})();
