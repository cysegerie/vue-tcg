async function apiGet(resource) {
    const url = new URL(`${this.baseURL}/${resource}`);
    const response = await fetch(url);
    return response.json();
}

async function apiPost(resource, data) {
    const response = await fetch(resource, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function apiUpdate(resource, data) {
    const response = await fetch(resource, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function apiDelete(resource) {
    const response = await fetch(resource, {
        method: 'DELETE'
    });
    return response.json();
}

export default { apiGet, apiPost, apiUpdate, apiDelete };