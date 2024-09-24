// Initialize Leaflet map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India




// Add a tile layer (OpenStreetMap)
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   maxZoom: 19,
// }).addTo(map);
L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);


const socket = io("https://localhost:3000");

let globalCurrentCoordinates = null;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    globalCurrentCoordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log('Current location:', globalCurrentCoordinates);
  });
} else {
  alert('Geolocation is not supported by this browser.');
}


function getlocation(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  const marker = L.marker([latitude, longitude]).addTo(map).bindPopup("I am here!").openPopup();

  map.setView([latitude, longitude], 13);

  socket.emit('locationUpdate', { latitude: latitude, longitude: longitude })
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getlocation, (error) => {
    console.error('Error getting location: ', error);
  });
} else {
  alert('Geolocation is not supported by this browser.');
}

let routes = null;
let marker = null;
// Search functionality
document.getElementById('searchButton').addEventListener('click', function () {
  const locationName = document.getElementById('locationInput').value;

  // Fetch geocoding results from Nominatim
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0]; // Get the first result
        map.setView([lat, lon], 22); // Zoom in on the location

        // Optional: Add a marker
        marker = L.marker([lat, lon]).addTo(map)
          .bindPopup(locationName)
          .openPopup();

      } else {
        alert('Location not found');
      }
    })
    .catch(error => {
      console.error('Error fetching location:', error);
    });
});


document.getElementById('getDirection').addEventListener('click', function () {
  const locationName = document.getElementById('locationInput').value;

  // Fetch geocoding results from Nominatim
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0]; // Get the first result
        // map.setView([lat, lon], 13); // Zoom in on the location

        // Optional: Add a marker
        if (routes || marker) {
          map.removeControl(routes);
          // map.removeLayer(markers);
        }

        routes = L.Routing.control({
          waypoints: [
            L.latLng(globalCurrentCoordinates.lat, globalCurrentCoordinates.lng),
            L.latLng(lat, lon)
          ]
        }).addTo(map);

      } else {
        alert('Location not found');
      }
    })
    .catch(error => {
      console.error('Error fetching location:', error);
    });
  L.map.setview([globalCurrentCoordinates.lat, globalCurrentCoordinates.lng], 10)
});
