import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

function fetchData(endpoint: string) {
  return axiosInstance
    .get(`/${endpoint}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log('Could not fetch data');
      throw error;
    });
}

function postItem<T>(endpoint: string, newGroup: Partial<T>): Promise<T> {
  return axiosInstance
    .post(`/${endpoint}`, newGroup)
    .then((response) => response.data)
    .catch((error) => {
      console.log('Could not post data: ', error.message);
      throw error;
    });
}

function deleteItem(endpoint: string, id: string) {
  return axiosInstance
    .delete(`/${endpoint}/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log('Could not delete');
      throw error;
    });
}

function patchItem<T>(endpoint: string, id: string, updatedData: Partial<T>): Promise<T> {
  return axiosInstance
    .patch(`/${endpoint}/${id}`, updatedData)
    .then((response) => response.data)
    .catch((error) => {
      console.log('Could not patch item');
      throw error;
    });
}

export const Requests = {
  fetchData,
  postItem,
  deleteItem,
  patchItem,
};
