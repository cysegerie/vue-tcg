import { apiGet } from '@/services/ApiService.js';
import { BASE_API_CARDS } from '@/utilities/const.js';

export async function fetchCards(id) {
    try {
        const url = id ? `${BASE_API_CARDS}/${id}` : BASE_API_CARDS;
        const response = await apiGet(url);
        console.log('Cards fetched:', response);
        return response;
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
};

export async function fetchCardsByPage(page, itemsPerPage) {
    try {
        const url = `${BASE_API_CARDS}?pagination:page=${page}&pagination:itemsPerPage=${itemsPerPage}`;
        const response = await apiGet(url);
        console.log('Cards fetched:', response);
        return response;
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
}