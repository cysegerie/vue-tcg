import { apiGet } from '@/services/ApiService.js';
import { BASE_API_CARDS } from '@/utilities/const.js';

export async function fetchCards() {
    try {
        const response = await apiGet(BASE_API_CARDS);
        return response;
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
};

