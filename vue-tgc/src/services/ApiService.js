class ApiService {
    constructor(baseURL) {
        if (!baseURL) {
            throw new Error('Base URL is required');
        }
        this.baseURL = baseURL;
    }

    async get(resource) {
        const url = new URL(`${this.baseURL}/${resource}`);
        const response = await fetch(url);
        return response.json();
    }

    async post(resource, data) {
        const response = await fetch(`${this.baseURL}/${resource}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async update(resource, data) {
        const response = await fetch(`${this.baseURL}/${resource}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async delete(resource) {
        const response = await fetch(`${this.baseURL}/${resource}`, {
            method: 'DELETE'
        });
        return response.json();
    }
}

export default ApiService;