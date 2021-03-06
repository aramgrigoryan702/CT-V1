import URLSearchParams from "url-search-params";

export const url = process.env.REACT_APP_API_URL;

/*These are the django client ID and SECRET
  from the OauthToolkit Application registered in your django admin
*/
export const django_client_id = "hUq5QmrIYSHu15LKS7nHjnXteMApeTHHTwSEWz9x";
export const django_client_secret = "ealGKj90JJ3ERVVPOeFpwbZhUgNVZIvNERXSLlqmQKHcUCm8nLxAd3wtzYmbEh61ER6x4XqZGO0yd8vj9JL4PHmdPREx3VMXdOHYsDLWcXZQiiet3AP4HcOpyxkifJtB";

const isAuthenticating = () => ({
  type: "GOOG_IS_AUTHENTICATING"
});

function convertGoogTokenSuccess(json) {
//   localStorage.setItem("goog_access_token_conv", json.access_token);
//   localStorage.setItem("goog_refresh_token_conv", json.refresh_token);
//   let expiryDate = Math.round(new Date().getTime() / 1000) + json.expires_in;
//   localStorage.setItem("goog_access_token_expires_in", expiryDate);
  return {
    type: "CONVERT_GOOG_TOKEN_SUCCESS",
    goog_token: json
  };
}

function googleLogoutAction() {
  return function(dispatch) {
    localStorage.removeItem("goog_access_token_conv");
    localStorage.removeItem("goog_refresh_token_conv");
    localStorage.removeItem("goog_access_token_expires_in");
    localStorage.removeItem("GmailID");
    localStorage.removeItem("isRegistered");
    dispatch({ type: "GOOGLE_LOGOUT" });
    return Promise.resolve();
  };
}

const convertGoogTokenFailure = err => ({
  type: "CONVERT_GOOG_TOKEN_FAILURE",
  err
});

// the API endpoint expects form-urlencoded-data thus search-params
function convertGoogleToken(googleId, nextPage) {
  return async function(dispatch) {
    dispatch(isAuthenticating());
    const searchParams = new URLSearchParams();
    // searchParams.set("grant_type", "convert_token");
    // searchParams.set("client_id", django_client_id);
    // searchParams.set("client_secret", django_client_secret);
    // searchParams.set("backend", "google-oauth2");
    // searchParams.set("token", access_token);
    searchParams.set("GmailID", googleId);
    console.log(nextPage);
    try {
      let response = await fetch(`${url}/auth/login/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: searchParams
      });
      if (!response.ok) {
        throw new Error("An Error has occured, please try again.");
      }
      let responseJson = await response.json();
      await localStorage.setItem("GmailID", googleId);
      if (responseJson.loginSuccess) {
            await localStorage.setItem("isRegistered", "true");
      } else {
            console.log("responseJson.loginSuccess", responseJson.loginSuccess);
            await localStorage.setItem("isRegistered", "false");
      }
    //   console.log(localStorage);
        window.location = nextPage;
    // return dispatch(convertGoogTokenSuccess(responseJson));

    } catch (err) {
        return dispatch(convertGoogTokenFailure(err));
    }
  };
}

function convertGoogleToken2(googleId, path) {
    return async function(dispatch) {
      dispatch(isAuthenticating());
      const searchParams = new URLSearchParams();
      // searchParams.set("grant_type", "convert_token");
      // searchParams.set("client_id", django_client_id);
      // searchParams.set("client_secret", django_client_secret);
      // searchParams.set("backend", "google-oauth2");
      // searchParams.set("token", access_token);
      searchParams.set("GmailID", googleId);
      try {
        let response = await fetch(`${url}/auth/login/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: searchParams
        });
        if (!response.ok) {
          throw new Error("An Error has occured, please try again.");
        }
        let responseJson = await response.json();
        await localStorage.setItem("GmailID", googleId);
        if (responseJson.loginSuccess) {
              await localStorage.setItem("isRegistered", "true");
        } else {
              console.log("responseJson.loginSuccess", responseJson.loginSuccess);
              await localStorage.setItem("isRegistered", "false");
        }
        console.log(localStorage);
        window.location.reload();
      // return dispatch(convertGoogTokenSuccess(responseJson));
  
      } catch (err) {
          return dispatch(convertGoogTokenFailure(err));
      }
    };
  }

export { convertGoogleToken, convertGoogleToken2, convertGoogTokenSuccess, googleLogoutAction };
