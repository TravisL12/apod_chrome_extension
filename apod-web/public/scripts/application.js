(function () {
  const root = document.getElementById("root");
  const APOD_API_URL = "https://api.nasa.gov/planetary/apod";
  const API_KEY = "hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447";

  async function fetchImage() {
    const params = new URLSearchParams(location.search);
    const date = params.get("date");
    if (!date) {
      console.log("NO DATE!");
      return;
    }

    const url = `${APOD_API_URL}?api_key=${API_KEY}&date=${date}`;
    const resp = await fetch(url);
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

  fetchImage();
})();
