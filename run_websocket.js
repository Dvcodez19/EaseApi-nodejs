// importing libraries :
const WebSocket = require(`ws`);
const EaseApiTicker = require(`./lib/easeapi-ticker`);
const log = {
  info: (...args) => {
    console.info(new Date().toISOString(), `- INFO -`, ...args)
  },
  warn: (...args) => {
    console.warn(new Date().toISOString(), `- WARN -`, ...args)
  },
  error: (...args) => {
    console.error(new Date().toISOString(), `- ERROR -`, ...args)
  },
};

// market data ticker : 
ticker = new EaseApiTicker(
  `VUz2rue5R0mYqe3jx5Ic`,   
  `AA0605`,
  `eyJraWQiOiJlMDc0TUpqYnJLTXhEU3lSN2tWY25xY0x1TXFhUG92TlBNQ0FKM0VwRTBFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MGNjZmVjZC0yODg3LTRmOWQtYTMwMS05ZDlkNWI5M2FjMmQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX0ZUc1JPTmNWYSIsImNsaWVudF9pZCI6IjczaTNodXVsbGllYzkzMHZobjZzbGo0YWs4Iiwib3JpZ2luX2p0aSI6IjYzN2Q5NGVkLWQ2OTAtNDYwMi1hNTM2LTA4NGNmMjY0MmRmNiIsImV2ZW50X2lkIjoiMDM1MjY1NDMtYzg5Ny00MTc2LTkzZTctMTBlNTAwNDIyOTJiIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc1MzA3OTU5NiwiZXhwIjoxNzUzMTY1OTk2LCJpYXQiOjE3NTMwNzk1OTYsImp0aSI6IjJmODlkZTI4LWY0MTMtNDhjNS04YzhkLWI2YTQxNTRkZjhmZCIsInVzZXJuYW1lIjoiYWEwNjA1In0.LElcNY1d9MMBSVZoynHHgeoAixBiY5qoqrApAr11j71SF8z7m_N12egwX1fK8QPwKKl72T6u3n1_Ynt1NFiTr_tTuZl0NXb7fxcw37Svo0RT5z2YfPLkQEd7mg4J_sHIWcHaG1BhMJd7cNtUCUKQGGa7h815TDegPfb_xaw0MpNBvCsX3YF-k-Un0iqr9R06XiABV8luNcZR_a1OiBaS3431Jpq1tkh8fOJFpgdZ8maA102teFDNsG81ax0YtzKrO1b_oJTlaJNpxMZT-aMcynppRy2nx5waAaZDk7vxxyJhVf1_CZ6tYYLwpH2xp4-ZktjXR6mLyRCTQKInvq-kmg`
);

// order status ticker :
order_ticker = new EaseApiTicker(
  `VUz2rue5R0mYqe3jx5Ic`,
  `AA0605`,
  `eyJraWQiOiJlMDc0TUpqYnJLTXhEU3lSN2tWY25xY0x1TXFhUG92TlBNQ0FKM0VwRTBFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MGNjZmVjZC0yODg3LTRmOWQtYTMwMS05ZDlkNWI5M2FjMmQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX0ZUc1JPTmNWYSIsImNsaWVudF9pZCI6IjczaTNodXVsbGllYzkzMHZobjZzbGo0YWs4Iiwib3JpZ2luX2p0aSI6IjYzN2Q5NGVkLWQ2OTAtNDYwMi1hNTM2LTA4NGNmMjY0MmRmNiIsImV2ZW50X2lkIjoiMDM1MjY1NDMtYzg5Ny00MTc2LTkzZTctMTBlNTAwNDIyOTJiIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc1MzA3OTU5NiwiZXhwIjoxNzUzMTY1OTk2LCJpYXQiOjE3NTMwNzk1OTYsImp0aSI6IjJmODlkZTI4LWY0MTMtNDhjNS04YzhkLWI2YTQxNTRkZjhmZCIsInVzZXJuYW1lIjoiYWEwNjA1In0.LElcNY1d9MMBSVZoynHHgeoAixBiY5qoqrApAr11j71SF8z7m_N12egwX1fK8QPwKKl72T6u3n1_Ynt1NFiTr_tTuZl0NXb7fxcw37Svo0RT5z2YfPLkQEd7mg4J_sHIWcHaG1BhMJd7cNtUCUKQGGa7h815TDegPfb_xaw0MpNBvCsX3YF-k-Un0iqr9R06XiABV8luNcZR_a1OiBaS3431Jpq1tkh8fOJFpgdZ8maA102teFDNsG81ax0YtzKrO1b_oJTlaJNpxMZT-aMcynppRy2nx5waAaZDk7vxxyJhVf1_CZ6tYYLwpH2xp4-ZktjXR6mLyRCTQKInvq-kmg`
); 

// Defining your (user's) tick callback :
async function on_ticks(ws, data) {
  log.info(data);
}

// Defining your (user's) on_connect callback :
async function on_connect(ws, response) {
  log.info(`Connected`);

  // For market data connection :
  if (ws.ws_url === ws.market_data_url) {
    await ws.subscribe([`2885`], ws.EXCHANGE_NSE); // RELIANCE, TCS on NSE
    await ws.subscribe([`500570`],ws.EXCHANGE_BSE); // TATAMOTORS on BSE
  }

  // For order status connection :
  else if (ws.ws_url === ws.order_status_url) {
    log.info(`Connected to order status WebSocket`);
    // order status websocket it will push updates automatically
  }
}

// Defining your (user's) on_close callback :
async function on_close(ws, close_status_code, close_msg) {
  log.info(`Disconnected : ` + close_msg);
}

// Set callbacks for market data :
ticker.on_ticks = on_ticks;
ticker.on_connect = on_connect;
ticker.on_close = on_close;
// Example : Connect to market data endpoint (default)
ticker.connect();

// Set callbacks for order status:
order_ticker.on_ticks = on_ticks;
order_ticker.on_connect = on_connect;
order_ticker.on_close = on_close;
// Example : Connect to order status endpoint
order_ticker.connect(true);