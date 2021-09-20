import decode from "jwt-decode";
import Cookies from "universal-cookie";
import get from "lodash/get";
const cookies = new Cookies();
//  TODO: Implement serverside sesssions and remove local storage JWT Auth

class JwtAuth {
  isSignedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage

    return !!token && !this.isTokenExpired(token);
  };

  isTokenExpired = (token) => {
    try {
      const decoded = decode(token);
      if (decoded.exp > Date.now() / 1000) return false;
    } catch (err) {}
    return true;
  };

  setToken = (token, userId) => {
    cookies.set("auth", token, {
      path: "/",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    cookies.set("userId", userId, {
      path: "/",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  getToken = () => {
    let token = cookies.get("auth");
    return token ? token : null;
  };
  getUserId = () => {
    let userId = cookies.get("userId");
    return userId ? userId : null;
  };

  logout = () => {
    cookies.remove("auth", { path: "/" });
    localStorage.removeItem("cart");
    localStorage.removeItem("ablytoken");
    cookies.remove("userId", { path: "/" });
    cookies.remove("cart", { path: "/" });
    if (get(window, "__ably.connection.state") === "connected") {
      window.__ably.connection.close();
    }
  };

  getConfirm = () => {
    // Using jwt-decode npm package to decode the token
    let answer = decode(this.getToken());
    console.log("Recieved answer!");
    return answer;
  };
}

export default new JwtAuth();
export { JwtAuth };
