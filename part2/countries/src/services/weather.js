import axios from 'axios';

const apiKey = import.meta.env.VITE_SOME_KEY;

const getAll = (lat, lon) => {
    const baseUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${apiKey}`;
    const request = axios.get(baseUrl);

    return request
        .then(response => {
            return response.data; // You may want to return the data for further processing
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

export default { getAll };