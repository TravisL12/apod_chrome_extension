import { API_KEY, APOD_API_URL } from '../constants';
import axios from 'axios';
import { TFetchOptions } from '../pages/types';

export const fetchImage = async (options: TFetchOptions = {}) => {
  const params = {
    api_key: API_KEY,
    ...options,
  };
  try {
    const resp = await axios.get(APOD_API_URL, { params });
    return resp.data[0] || resp.data;
  } catch (err) {
    console.error(err);
  }
};
