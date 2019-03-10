var axios = require('axios');


exports.facebook = function (access_token) {
  var fields = 'id, name, email, picture';
  var url = 'https://graph.facebook.com/me';
  var params = { access_token: access_token, fields: fields };
  return axios.get(url, { params: params }).then(function (response) {
    var data = response.data;

    return {
      service: 'facebook',
      picture: data.picture.data.url,
      id: data.id,
      name: data.name,
      email: data.email
    };
  });
};

exports.google = function (access_token) {
  var url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  var params = { access_token: access_token };
  return axios.get(url, { params: params }).then(function (response) {
    var data = response.data;

    return {
      service: 'google',
      picture: data.picture,
      id: data.sub,
      name: data.name,
      email: data.email
    };
  });
};
