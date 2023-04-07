import axios from 'axios';

const apiBase = 'http://gitlab.lumin.tech/api/v4';
let accessToken = '';
axios.defaults.baseURL = apiBase;

function setAccessToken(token) {
  accessToken = token;
  axios.defaults.headers.common['PRIVATE-TOKEN'] = token;
}

function getAccessToken() {
  return accessToken;
}

function checkToken(token) {
  return axios.get('/version', {
    headers: { 'PRIVATE-TOKEN': token },
  });
}
function getNamespaces() {
  return axios.get('/namespaces');
}
export {
  checkToken,
  getNamespaces,
  getAccessToken,
  setAccessToken,
};
