import { API_KEY, APOD_API_URL } from '../constants';
import axios from 'axios';

export const fetchImage = async () => {
  const params = {
    api_key: API_KEY,
  };
  try {
    const resp = await axios.get(APOD_API_URL, { params });
    return resp.data;
  } catch (err) {
    console.error(err);
  }
};
