const apiKey = 'e27a21e3b7msh251e1b685df4775p119b5cjsn229214b9fa6c';
const weatherApiUrl = 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather';
const airQualityApiUrl = 'https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality';

const options = {
    headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
    }
};

const airQualityOptions = {
    headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com'
    }
};

const fetchWeatherAndAirQuality = async (city) => {
    try {
        const [weatherResponse, airQualityResponse] = await Promise.all([
            fetch(`${weatherApiUrl}?city=${city}`, options),
            fetch(`${airQualityApiUrl}?city=${city}`, airQualityOptions)
        ]);

        if (!weatherResponse.ok || !airQualityResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const [weatherData, airQualityData] = await Promise.all([
            weatherResponse.json(),
            airQualityResponse.json()
        ]);

        updateWeatherUI(city, weatherData);
        updateAirQualityUI(airQualityData);
        setWeatherBackground(weatherData.cloud_pct, weatherData.humidity, weatherData.temp);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error state, e.g., display error message or default values
        updateWeatherUI(city, { temp: 'N/A', min_temp: 'N/A', max_temp: 'N/A', humidity: 'N/A', cloud_pct: 'N/A', feels_like: 'N/A', wind_speed: 'N/A', wind_degrees: 'N/A', sunrise: 'N/A', sunset: 'N/A' });
        updateAirQualityUI({ overall_aqi: 'N/A', CO: { aqi: 'N/A' }, NO2: { aqi: 'N/A' }, O3: { aqi: 'N/A' }, SO2: { aqi: 'N/A' }, 'PM2.5': { aqi: 'N/A' }, PM10: { aqi: 'N/A' } });
    }
};

const updateWeatherUI = (city, data) => {
    document.getElementById('cityName').innerHTML = city;
    document.getElementById('temp').innerHTML = data.temp;
    document.getElementById('min_temp').innerHTML = data.min_temp;
    document.getElementById('max_temp').innerHTML = data.max_temp;
    document.getElementById('humidity').innerHTML = data.humidity;
    document.getElementById('cloud_pct').innerHTML = data.cloud_pct;
    document.getElementById('feels_like').innerHTML = data.feels_like;
    document.getElementById('wind_speed').innerHTML = data.wind_speed;
    document.getElementById('wind_degrees').innerHTML = data.wind_degrees;
    document.getElementById('sunrise').innerHTML = formatTime(data.sunrise);
    document.getElementById('sunset').innerHTML = formatTime(data.sunset);
};

const updateAirQualityUI = (data) => {
    setInnerHtml('current_aqi', data.overall_aqi);
    setInnerHtml('co_aqi', data.CO?.aqi);
    setInnerHtml('no2_aqi', data.NO2?.aqi);
    setInnerHtml('o3_aqi', data.O3?.aqi);
    setInnerHtml('so2_aqi', data.SO2?.aqi);
    setInnerHtml('pm25_aqi', data['PM2.5']?.aqi);
    setInnerHtml('pm10_aqi', data.PM10?.aqi);
};

const setInnerHtml = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = value ?? 'N/A';
    }
};

const setWeatherBackground = (cloud_pct, humidity, temp) => {
    const videoElement = document.getElementById('backgroundVideo');
    const videoSource = document.getElementById('videoSource');
    let videoSrc = 'default.mp4';

    if (temp < 10) {
        videoSrc = 'winter_4k.mp4';
    } else if (temp > 30) {
        videoSrc = 'sunny_4k.mp4';
    } else if (humidity > 70) {
        videoSrc = 'rainy_4k.mp4';
    } else if (cloud_pct > 50) {
        videoSrc = 'cloudy_4k.mp4';
    }

    videoSource.src = videoSrc;
    videoElement.load();
};

// Format time from timestamp
const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();
    const city = document.getElementById('city').value;
    await fetchWeatherAndAirQuality(city);
});

// Initial load for default city
fetchWeatherAndAirQuality('Ahmedabad');
