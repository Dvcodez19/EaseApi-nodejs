'use strict';

let { API, getWithRootUrl } = require('./constants');
let axios = require('axios');
const cryptojs = require('crypto-js');
const querystring = require('querystring');
const https = require('https');
const Papa = require('papaparse');

var EaseApiGateway = function (params) {
  var self = this;
  self.app_key = params.app_key;
  self.session_expiry_hook = null;
  self.debug = params.debug || false; // Default debug to false
  self.disable_ssl = params.disable_ssl || false; // Default debug to false

  self.setClientId = function (client_id) {
    self.client_id = client_id;
  };

  self.setAuthToken = function (auth_token) {
    self.auth_token = auth_token;
  };

  self.setRefreshToken = function (refresh_token) {
    self.refresh_token = refresh_token;
  };

  self.setSessionExpiryHook = function (cb) {
    self.session_expiry_hook = cb;
  };

  self.getSsoUrl = function ({ state_variable }) {
    const ssoUrl = `${getWithRootUrl(API.login_url)}?app_key=${
      this.app_key
    }&state=${state_variable}`;
    return ssoUrl;
  };

  self.generate_auth_token = async function ({ request_token, secret_key }) {
    const concatenatedKeys = this.app_key + secret_key;

    // Compute SHA-256 hash and convert to lowercase hex
    const hashValue = cryptojs
      .SHA256(cryptojs.enc.Utf8.parse(concatenatedKeys))
      .toString(cryptojs.enc.Hex)
      .toLowerCase();

    const payload = {
      request_token: request_token,
      data: hashValue,
    };
    try {
      return self.post_request(
        getWithRootUrl(API.generate_auth_token),
        payload
      );
    } catch (error) {
      console.error('Error generating auth token:', error.message);
      return null;
    }
  };

  // Get Instruments
  self.get_instruments = async function () {
    const instrumentsCSV = await self.get_request(getWithRootUrl(API.get_instruments));
    return Papa.parse(instrumentsCSV, {
      header: true,
      skipEmptyLines: true,
      worker: false,
    }).data;
  };

  // Get Fund Details
  self.get_fund_details = function () {
    return self.get_request(getWithRootUrl(API.get_fund_details));
  };

  // Get Order Book
  self.get_orderbook = function () {
    return self.get_request(getWithRootUrl(API.get_orderbook));
  };

  // Get Holdings
  self.get_holdings = function () {
    return self.get_request(getWithRootUrl(API.holdings));
  };

  // Get Positions
  self.get_positions = function () {
    return self.get_request(getWithRootUrl(API.positions));
  };

  // Get Tradebook
  self.get_tradebook = function () {
    return self.get_request(getWithRootUrl(API.get_tradebook));
  };

  // Get User Profile
  self.get_user_profile = function () {
    return self.get_request(getWithRootUrl(API.get_user_profile));
  };

  // Logout
  self.logout = function () {
    const payload = {
      refresh_token: this.refresh_token,
    };
    return self.post_request(getWithRootUrl(API.logout), payload);
  };

  // Place Delivery Order
  self.place_delivery_order = function (payload) {
    return self.post_request(getWithRootUrl(API.place_delivery_order), payload);
  };

  // Place Intraday Order
  self.place_intraday_order = function (payload) {
    return self.post_request(getWithRootUrl(API.place_intraday_order), payload);
  };

  // Cancel Order
  self.cancel_order = function (payload) {
    return self.post_request(getWithRootUrl(API.cancel_order), payload);
  };

  // Modify Order
  self.modify_order = function (payload) {
    return self.post_request(getWithRootUrl(API.modify_order), payload);
  };

  // Create an https agent conditionally based on disable_ssl flag
  const agent = self.disable_ssl
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

  // Create the axios instance with the httpsAgent property set if needed
  var requestInstance = axios.create({
    headers: {
      'User-Agent': 'EaseApi-nodejs/1.0.0',
      'X-EaseApi-Version': '1',
    },
    paramsSerializer: function (params) {
      return querystring.stringify(params);
    },
    httpsAgent: agent,
  });

  // Interceptor to dynamically add the client_id, and Authorization headers before each request
  requestInstance.interceptors.request.use(
    function (config) {
      config.headers['x-client-id'] = self.client_id;
      config.headers['x-app-key'] = self.app_key;
      config.headers['Authorization'] = 'Bearer ' + self.auth_token;

      if (self.debug) {
        console.log('Request Config:', config);
      }

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  requestInstance.defaults.headers.post['Content-Type'] = 'application/json';

  requestInstance.interceptors.response.use(
    (response) => {
      // Minimal log if debugging is enabled
      if (self.debug) {
        console.log('Response received, status:', response.status);
      }
      return response.data;
    },
    (error) => {
      // Log only a minimal error message
      console.error('API call error:', error.message);
      return Promise.reject(error);
    }
  );

  // Define the get_request method
  self.get_request = function (fullUrl) {
    return requestInstance
      .get(fullUrl)
      .then((response) => response) // Return only the data
      .catch((err) => {
        console.error(`Error in get_request for ${fullUrl}: ${err}`);
        throw err; // Propagate the error
      });
  };

  // Define the post_request method
  self.post_request = function (fullUrl, data) {
    return requestInstance
      .post(fullUrl, data)
      .then((response) => response) // Return only the data
      .catch((err) => {
        console.error(`Error in post_request for ${fullUrl}: ${err.message}`);
        throw err; // Propagate the error
      });
  };
};

module.exports = EaseApiGateway;
