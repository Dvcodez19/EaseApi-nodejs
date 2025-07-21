// importing libraries for websocket :
const WebSocket = require(`ws`);
const EventEmitter = require(`events`);

class EaseApiTicker extends EventEmitter {
  /* EaseAPI ws client for subscribing to real-time market data and order status. */

  constructor(app_key, client_id, auth_token) {
    super();

    // Base Websocket URL :
    this.BASE_WS_URL = `wss://easeapi-ws.venturasecurities.com`;

    // Websocket endpoint paths :
    this.MARKET_DATA_PATH = `/v1/easeapi_mktdata`;
    this.ORDER_STATUS_PATH = `/v1/easeapi_ob`;

    // Constants for supported exchanges :
    this.EXCHANGE_NSE = `nse`;
    this.EXCHANGE_BSE = `bse`;
    this.EXCHANGE_FNO = `fno`; // NSE Futures & Options
    this.EXCHANGE_BFO = `bfo`; // BSE Futures & Options

    // Initialize the EaseApiTicker :

    // Client details :
    this.app_key = app_key; // Your EaseApi Application Key
    this.client_id = client_id; // Your Client Id
    this.auth_token = auth_token; // Your Authorization Token

    // Websocket details :
    this.ws = null;

    // URL for market data :
    this.market_data_url = `${this.BASE_WS_URL}${this.MARKET_DATA_PATH}?app_key=${this.app_key}&client_id=${this.client_id}&authorization=${this.auth_token}`;

    // URL for order status :
    this.order_status_url = `${this.BASE_WS_URL}${this.ORDER_STATUS_PATH}?app_key=${this.app_key}&client_id=${this.client_id}&authorization=${this.auth_token}`;

    // By default we'll connect to market data :
    this.ws_url = this.market_data_url;

    // Connection state :
    this.connected = false;
    this.connecting = false;

    // Reconnection settings :
    this.reconnect_attempts = 0;
    this.max_reconnect_attempts = 5;
    this.reconnect_interval = 1;
    this.reconnect_timer = null;

    // Subscribed instruments - store as an object with exchange as key and set of tokens as value. e.g. {`nse`: {`2885`, `15`}, `bse`: {`500570`}}
    this.subscriptions = {};

    // Setting callbacks :
    this.on_ticks = null;
    this.on_connect = null;
    this.on_close = null;
    this.on_error = null;
    this.on_reconnect = null;
    this.on_noreconnect = null;
  }

  // To connect to Websocket :
  async connect(use_order_status) {
    /* Establish connection to the ws server. */

    /* Parameters : 
        use_order_status : bool
        If True, connect to order status endpoint
        If False, connect to market data endpoint
        */

    if (this.connecting || this.connected) {
      console.debug(`Already connected or connecting to Websocket`);
      return;
    }

    // Select the appropraite Websocket URL :
    this.ws_url = use_order_status ? this.order_status_url : this.market_data_url;
    let endpoint_type = use_order_status ? `order status` : `market data`;

    this.connecting = true;
    console.info(`Connecting to EaseApi Websocket : ${endpoint_type}`);
    
    try {
      this.ws = new WebSocket(this.ws_url);
      await new Promise((resolve, reject) => {
        this.ws.on(`open`, () => {
          this._on_open(this.ws);
          resolve();
        });
        this.ws.on(`message`, (message) => {
          this._on_message(this.ws, message);
        });
        this.ws.on(`error`, (error) => {
          this._on_error(this.ws, error);
          reject(error);
        });
        this.ws.on(`close`, (close_status_code, close_msg) => {
          this._on_close(this.ws, close_status_code, close_msg);
        });
      });
    } catch (e) {
      console.log(`Invalid credentials!`);
    }

    if (this.ping_interval) {
      clearInterval(this.ping_interval);
    }

    this.ping_interval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, 30000);   
  }
  _on_open(ws) {
    /* WebSocket on_open event handler. */
    console.info(`Websocket connected successfully`);
    this.connecting = false;
    this.connected = true;
    this.reconnect_attempts = 0;
    // Resubscribe to previously subscribed instruments :
    this._resubscribe();
    // Call user - defined callback :
    if (this.on_connect) {
      this.on_connect(this, {});
    }
  }
  _on_message(ws, message) {
    /* WebSocket on_message event handler. */
    try {
      let data = JSON.parse(message);
      if (this.on_ticks) {
        this.on_ticks(this, data);
      } else {
        console.debug(`Recieved tick data : ${data}`);
      }
    } catch (e) {
      console.warn(`Received non-JSON message : ${message}`);
      if (this.on_ticks) {
        this.on_ticks(this, message); 
      }
    }
  }
  _on_error(ws, error) {
    /* WebSocket on_error event handler. */
    console.error(`Websocket error : ${error}`);
    this.connecting = false;
    if (this.on_error) {
      this.on_error(this, null, error);
    }
  }
  _on_close(ws, close_status_code, close_msg) {
    /* WebSocket on_close event handler. */
    console.info(
      `Websocket connection closed : ${close_status_code} - ${close_msg}`
    );
    this.connecting = false;    
    this.connected = false;
    if (this.on_close) {
      this.on_close(this, close_status_code, close_msg);
    }
    // Always attempt to reconnect :
    this._handle_reconnect();
  }
  async _handle_reconnect() {
    /* Handle reconnection with fixed 1-second interval. */
    if (this.reconnect_attempts >= this.max_reconnect_attempts) {
      console.error(
        `Max reconnection attempts (${this.max_reconnect_attempts}) reached`
      );
      process.exit(0); // Terminates the code after it is done.
      if (this.on_noreconnect) {
        this.on_noreconnect(this);
      }
      return;
    }
    this.reconnect_attempts++;
    console.info(
      `Attempting to reconnect (${this.reconnect_attempts}/${this.max_reconnect_attempts}) in ${this.reconnect_interval}s...`
    );
    // Notify about reconnection attempt :
    if (this.on_reconnect) {
      this.on_reconnect(this, this.reconnect_attempts);
    }
    // Cancel existing timer if any :
    clearTimeout(this.reconnect_timer);

    // We'll reconnect to the same endpoint that was previously connected :
    this.reconnect_timer = setTimeout(async () => {
      await this._reconnect();
    }, this.reconnect_interval * 1000);
  }
  async _reconnect() {
    /* Reconnect to the same endpoint that was previously connected. */
    let use_order_status = this.ws_url === this.order_status_url;
    await this.connect(use_order_status);
  }
  _resubscribe() {
    /* Resubscribe to all previously subscribed instruments after reconnection. */
    if (!this.subscriptions) {
      return;
    }

    for (const [exchange, tokens] of Object.entries(this.subscriptions)) {
      if (tokens) {
        this.subscribe(Array.from(tokens), exchange, true);
      }
    }
  }
  _get_action_key(exchange) {
    /* Generate a key for LTP action  */
    let exchangeArr = [
      this.EXCHANGE_NSE,
      this.EXCHANGE_BSE,
      this.EXCHANGE_FNO,
      this.EXCHANGE_BFO,
    ];
    if (!exchangeArr.includes(exchange)) {
      console.warn(`Unsupported exchange : ${exchange}. Using NSE as default.`);
      exchange = this.EXCHANGE_NSE;
    }
    return `${exchange}:ltp`;
  }
  subscribe(tokens, exchange, skip_add) {
    /* Subscribe to LTP market data for specified tokens. */
    /* Parameters : 
            tokens : str, int, array
            - Single token or a array of tokens to subscribe 
            exchange : str, optional 
             - Exchange to subscribe to (default :`nse` )
             - Supported exchanges : `nse`,`bse`,`fno`,`bfo` 
            skip_add : bool, optional
             - If true, don't update subscriptions array (used for resubscribing)
            Returns : 
            bool 
            - true if subscriptions request was sent, false otherwise     
        */
    if (!this.connected) {
      console.warn(`Cannot subscribe, Websocket not connected`);
      return false;
    }
    // Validate exchange :
    let exchangeArr = [
      this.EXCHANGE_NSE,
      this.EXCHANGE_BSE,
      this.EXCHANGE_FNO,
      this.EXCHANGE_BFO,
    ];
    if (!exchangeArr.includes(exchange)) {
      console.warn(`Unsupported exchange : ${exchange}. Using NSE as default.`);
      exchange = this.EXCHANGE_NSE;
    }
    // Convert single token to array :
    if (!Array.isArray(tokens)) {
      tokens = [String(tokens)];
    } else {
      // Ensure all tokens are strings :
      tokens = tokens.map((token) => String(token));
    }
    // Prepare subscription message :
    const action_key = this._get_action_key(exchange);
    const actions = [action_key];

    // Update subscription set :
    if (!skip_add) {
      if (!this.subscriptions[exchange]) {
        this.subscriptions[exchange] = new Set();
      }
      // Add tokens to the subscription set :
      tokens.forEach((token) => {
        this.subscriptions[exchange].add(token);
      });
    }
    // Create subscriptions message :
    let subscribe_msg = {
      actions: actions,
      token: tokens,
      mode: `sub`,
    };
    return this.send(subscribe_msg);
  }
  unsubscribe(tokens, exchange) {
    /* Unsubscribe to LTP market data for specified tokens. */
    /* Parameters : 
            tokens : str, int, array
            - Single token or a array of tokens to unsubscribe 
            exchange : str, optional 
             - Exchange to unsubscribe to (default :`nse` )
             - Supported exchanges : `nse`,`bse`,`fno`,`bfo`
            Returns : 
            bool 
            - true if unsubscriptions request was sent, false otherwise     
        */
    if (!this.connected) {
      console.warn(`Cannot unsubscribe, Websocket not connected`);
      return false;
    }
    // Validate exchange :
    let exchangeArr = [
      this.EXCHANGE_NSE,
      this.EXCHANGE_BSE,
      this.EXCHANGE_FNO,
      this.EXCHANGE_BFO,
    ];
    if (!exchangeArr.includes(exchange)) {
      console.warn(`Unsupported exchange : ${exchange}. Using NSE as default.`);
      exchange = this.EXCHANGE_NSE;
    }
    // Convert single token to array :
    if (!Array.isArray(tokens)) {
      tokens = [String(tokens)];
    } else {
      // Ensure all tokens are strings :
      tokens = tokens.map((token) => {
        String(token);
      });
    }
    // Prepare subscription message :
    const action_key = this._get_action_key(exchange);
    const actions = [action_key];

    // Update subscription set
    if (this.subscriptions[exchange]) {
      // Remove tokens from the subscription set :
      tokens.forEach((token) => {
        this.subscriptions[exchange].delete(String(token));
      });
      // Remove the exchange key if no tokens left :
      if (this.subscriptions[exchange].size === 0) {
        delete this.subscriptions[exchange];
      }
    }
    // Create unsubscriptions message :
    let unsubscribe_msg = {
      actions: actions,
      token: tokens,
      mode: `unsub`
    };
    return this.send(unsubscribe_msg);
  }
  send(data) {
    /* Send data to the websocket server.
            Parameters : 
            data : object or string 
             - Data to send to the server
            Returns : 
            bool
             - true if message was sent, false otherwise 
        */
    if (!this.connected) {
      console.warn(`Cannot send message, Websocket not connected`);
      return false;
    }
    try {
      if (typeof data === `object` && data != null) {
        data = JSON.stringify(data);
      }
      this.ws.send(data);
      return true;
    } catch (e) {
      console.error(`Error sending data : ` + e);
      return false;
    }
  }
  close() {
    /* Close the Websocket connection */
    // Cancel any pending connection :
    if (this.reconnect_timer) {
      clearTimeout(this.reconnect_timer);
    }
    if (this.ws) {
      this.ws.close();
    }
    this.connected = false;
    console.info(`Websocket connection closed`);
  }
  is_connected() {
    /*Check if WebSocket connection is established.
        Returns:
        bool
        true if connected, false otherwise */
    return this.connected;
  }
}
module.exports = EaseApiTicker;