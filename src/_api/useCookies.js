import Cookies from "universal-cookie";
const cookies = new Cookies();

function setFunction(name, value, options) {
  cookies.set(name, value, options);
}
function getFunction(name) {
  return cookies.get(name);
}
function deleteFunction(name) {
  cookies.set(name, "", { expires: Date.now() });
}

export default () => ({
  setCookie: setFunction,
  getCookie: getFunction,
  deleteCookie: deleteFunction,
});
