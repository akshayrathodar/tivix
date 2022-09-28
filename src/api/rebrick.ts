import axios from "axios";
import { BASE_API_URL, REBRiCK_API_KEY } from './config/config';

export const getAllMinifigs = () => {
    return axios.get(BASE_API_URL + 'minifigs/?search=harry potter&key=' + REBRiCK_API_KEY)
};

export const getMinfigParts = (currentMinfig: string) => {
    return axios.get(BASE_API_URL + 'minifigs/'+ currentMinfig +'/parts/?key=' + REBRiCK_API_KEY)
}

export const postMyData = (payload: any) => {
    return new Promise(function(resolve) {
        setTimeout(resolve, 0);
    });
}