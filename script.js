const apiKey = "d1902034bf38b519ae1abde0cc44841b";
const apiUrl = "http://api.openweathermap.org/data/2.5/weather";

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');

function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

searchButton.addEventListener('click', () => {
    const rawLocation = locationInput.value.trim();
    const location = removeDiacritics(rawLocation);
    if (location) {
        fetchWeather(location, rawLocation);
    }
});

function fetchWeather(location, displayName) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            locationElement.textContent = displayName || data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            locationElement.textContent = "City not found";
            temperatureElement.textContent = "";
            descriptionElement.textContent = "";
        });
}
function clearFields() {
    document.getElementById('locationInput').value = '';
    document.getElementById('location').textContent = '';
    document.getElementById('temperature').textContent = '';
    document.getElementById('description').textContent = '';
}
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        async function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
                    headers: {
                        'User-Agent': 'example-app' // 👈 nên có nếu gọi từ server
                    }
                });
                const data = await response.json();
                const city = data.address.city || data.address.town || data.address.village || data.address.county;

                document.getElementById("city").textContent = city
                    ? `Bạn đang ở: ${city}`
                    : "Không xác định được thành phố.";
            } catch (error) {
                document.getElementById("city").textContent = "Lỗi khi lấy thông tin thành phố.";
                console.error(error);
            }
        },
        function(error) {
            document.getElementById("city").textContent = `Lỗi định vị: ${error.message}`;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
} else {
    document.getElementById("city").textContent = "Trình duyệt không hỗ trợ Geolocation.";
}