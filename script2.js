const apiKey = "d1902034bf38b519ae1abde0cc44841b";
const forecastApi = "https://api.openweathermap.org/data/2.5/forecast";

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
    const url = `${forecastApi}?q=${location}&appid=${apiKey}&units=metric`;

    function fetchWeather(location, displayName) {
        const url = `${forecastApi}?q=${location}&appid=${apiKey}&units=metric`;
    }
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("City not found");
                }
                return response.json();
            })
            .then(data => {
                // Lọc dữ liệu cho ngày mai
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowDate = tomorrow.toISOString().split('T')[0]; // "YYYY-MM-DD"
    
                const forecastForTomorrow = data.list.find(item => item.dt_txt.startsWith(tomorrowDate) && item.dt_txt.includes("12:00:00"));
                
                if (forecastForTomorrow && locationElement && temperatureElement && descriptionElement) {
                    locationElement.textContent = displayName || data.city.name;
                    temperatureElement.textContent = `${Math.round(forecastForTomorrow.main.temp)}°C`;
                    descriptionElement.textContent = forecastForTomorrow.weather[0].description;
                } else {
                    throw new Error("No forecast data for tomorrow");
                }
            })
            .catch(error => {
                console.error('Error fetching weather forecast:', error);
                if (locationElement && temperatureElement && descriptionElement) {
                    locationElement.textContent = "Không tìm thấy dữ liệu";
                    temperatureElement.textContent = "";
                    descriptionElement.textContent = "";
                }
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
            const currentLat = position.coords.latitude;
            const currentLon = position.coords.longitude;

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLat}&lon=${currentLon}&zoom=10&addressdetails=1`, {
                    headers: {
                        'User-Agent': 'example-app'
                    }
                });
                const data = await response.json();
                const city = data.address.city || data.address.town || data.address.village || data.address.county;

                const cityElement = document.getElementById("city");
                if (cityElement) {
                    cityElement.textContent = city
                        ? `Bạn đang ở: ${city}`
                        : "Không xác định được thành phố.";
                }
            } catch (error) {
                const cityElement = document.getElementById("city");
                if (cityElement) {
                    cityElement.textContent = "Lỗi khi lấy thông tin thành phố.";
                }
                console.error(error);
            }
        },
        function(error) {
            const cityElement = document.getElementById("city");
            if (cityElement) {
                cityElement.textContent = `Lỗi định vị: ${error.message}`;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
} else {
    const cityElement = document.getElementById("city");
    if (cityElement) {
        cityElement.textContent = "Trình duyệt không hỗ trợ Geolocation.";
    }
}