import axios from 'axios';
//https://api.b7web.com.br/
const api = axios.create({
  baseURL:'http://192.168.1.7:3333',
});

export default api;