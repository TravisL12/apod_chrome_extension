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
    const data = resp.data[0] || resp.data;
    data.date = data.date.replace('-0', '-');

    return data;
  } catch (err) {
    console.error(err);
  }
};
