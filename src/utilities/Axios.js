import axios from 'axios';
import { AUTH_TOKEN, API_ENDPOINT } from 'configs/constants';

class AxiosService {
    constructor() {
        const service = axios.create({
            baseURL: API_ENDPOINT,
            headers: {
                Accept: 'application/json',
            },
        });
        service.interceptors.request.use(this.handleInterceptRequest);
        // service.interceptors.response.use(this.handleSuccess, this.handleError);
        this.service = service;
    }

    setHeader(name, value) {
        this.service.defaults.headers.common[name] = value;
    }

    removeHeader(name) {
        delete this.service.defaults.headers.common[name];
    }

    handleInterceptRequest(config) {
        const headerPayload = localStorage.getItem(AUTH_TOKEN);
        if (headerPayload) {
            config.headers.Authorization = `Bearer ${headerPayload}`;
        }

        return config;
    }

    handleSuccess(response) {}

    handleError = (error) => {};

    async get(endpoint, options) {
        return this.service.get(endpoint, options);
    }

    async post(endpoint, payload, options) {
        return this.service.post(endpoint, payload, options);
    }

    async put(endpoint, payload, options) {
        return this.service.put(endpoint, payload, options);
    }

    async delete(endpoint, options) {
        return this.service.delete(endpoint, options);
    }
}

export default new AxiosService();
