export async function apiGet(resource) {
    const response = await fetch(resource);
    return response.json();
}

export async function apiPost(resource, data) {
    const response = await fetch(resource, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function apiUpdate(resource, data) {
    const response = await fetch(resource, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function apiDelete(resource) {
    const response = await fetch(resource, {
        method: 'DELETE'
    });
    return response.json();
}


