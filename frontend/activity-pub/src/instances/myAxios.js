import axios from "axios";

const myAxios = axios.create({
	baseURL: "http://localhost:8000", // Replace with your backend URL
});

export default myAxios;
