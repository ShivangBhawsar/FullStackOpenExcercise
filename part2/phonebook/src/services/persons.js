import axios from 'axios'
const baseUrl = 'http://localhost:3002/persons'

const getAll = () => {
    return axios.get("http://localhost:3002/persons").then(response => response.data);
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (objectId, updatedObject) => {
    return axios.put(`${baseUrl}/${objectId}`, updatedObject);
}

const erase = objectId => {
    console.log("Deleting resource at: ", `${baseUrl}/${objectId}`);
    return axios.delete(`${baseUrl}/${objectId}`)
}

export default { create, getAll, update, erase }