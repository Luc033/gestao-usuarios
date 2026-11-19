import showToast from "./toast";

const API_URL = 'http://localhost:3001';


async function request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers:{
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    if(response.status === 204) return showToast(" ");

    const data = await response.json().catch(() => null);

    if(!response.ok){
        showToast(data?.error || 'Ocorreu um erro na requisição.', "error");
    }

    return data;    
}

export const userApi = {
    findAll(){ return request('/users'); },
    findById(id) { return request(`/users/${id}`); },
    create(user){
        return request('/users', {method: 'POST', body: JSON.stringify(user)});
    },
    update(id, user){
        return request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user)});
    },
    updatePassword(id, password){
        return request(`/users/${id}/password`, {method: 'PATCH', body: JSON.stringify(password)});
    },
    remove(id) { return request(`/users/${id}`, {method: 'DELETE'}); }
};

