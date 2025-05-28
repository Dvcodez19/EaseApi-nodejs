const { EaseApiGateway } = require('./lib');

/**
 * EaseAPI Demo - Trading Made Easy
 * This script demonstrates the complete functionality of EaseAPI
 * from authentication to order management and portfolio tracking.
 */
async function demonstrateEaseAPICapabilities() {
  try {
    // Welcome Message
    console.log('\n🚀 Welcome to EaseAPI Demo!');
    console.log("Let's explore the power of automated trading...\n");

    // Initialize Trading Environment
    console.log('🔧 Setting up trading environment...');
    const easeapi = new EaseApiGateway({
      app_key: 'CVnSgBwRhGhOCt6mjmUo',
      disable_ssl: true,
      debug: false,
    });

    // Begin Trading Journey
    console.log('\n🔑 Starting Authentication Process');
    console.log('=================================');

    // Generate login URL
    const sso_url = easeapi.getSsoUrl({ state_variable: 'abcd12345' });
    console.log('📱 Login URL Generated:', sso_url);


    // Authenticate User
    console.log("\n🔐 Authenticating User...");
    const authResponse = await easeapi.generate_auth_token({
      request_token: "r8Ewpv5aRM",
      secret_key: "5KzWbIZFQn",
    });

    // Print authentication details in a copy-friendly format
    console.log("\n========== Authentication Response ==========");
    console.log("\n🆔 Client ID");
    console.log("----------------");
    console.log(authResponse.client_id);
    console.log("\n🔑 Auth Token");
    console.log("----------------");
    console.log(authResponse.auth_token);
    console.log("\n🔄 Refresh Token");
    console.log("----------------");
    console.log(authResponse.refresh_token);
    console.log("\n===========================================\n");

    // Set up Trading Session
    console.log("✨ Setting up your trading session...");
    easeapi.setClientId({ client_id: authResponse.client_id });
    easeapi.setAuthToken({ auth_token: authResponse.auth_token });
    easeapi.setRefreshToken({ refresh_token: authResponse.refresh_token });



    // Set up Trading Session (development mode with hardcoded credentials)
    console.log('\n✨ Setting up your trading session (development mode)...');
    easeapi.setClientId('AA0605');
    easeapi.setAuthToken(
      'eyJraWQiOiJmWTdRYVhEYlR6TGtwYXlzMWR1Qk1kTHViSzFHcWlhZnlGd1RQWFQ1V1dZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5NTg4MTg4Yy0yZWYxLTQ1MzktYWM0NC1kZmU1NzY4OGQyNTAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX3Njc1VQdFM1QiIsImNsaWVudF9pZCI6IjUwdWVjOXJwN241cGVjaDliaDIxcTU3N3RjIiwib3JpZ2luX2p0aSI6Ijc5NTA2M2IxLWMzOWYtNDZjNi04NDFmLTdlMmFhNmJiNTdhYSIsImV2ZW50X2lkIjoiNmFkZTJmYjUtODM5Zi00NmVjLTgxNjQtN2MzODMyZWY3ZmIzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0MDQ2Mjc0NSwiZXhwIjoxNzQwNTQ5MTQ1LCJpYXQiOjE3NDA0NjI3NDUsImp0aSI6IjY5NWU0NGUyLTY2MjItNGQzMi1hZGQwLTEzNjk0ZTlmMzEwMSIsInVzZXJuYW1lIjoiYWEwNjA1In0.boFJN0mV2cxya7T_P5zrbcaJpVuMbsIgLZLf8uio-klgyC2I3zXq_LgAeabw_hpxbl-D7G_sARfQp1oldQsKONrctqdufv-WO40tVOc6-FNwnJa4WQBWmKxGh9QJPh1q1aIspQwAxgzOG8xGPqrC1GP7PCFGUWPgbJUJeS0jWgDCfq3iPFtprL4B-aDePxncgR4nkIWbO3ycQJLNoR61g6dHMHskWEztv-nX_hXzScixW7iFSA5mH9lFUkkjPVcLjih64MXIsRCsfsbo6y4LnpyrhZbJT4hHKQwpozumK148bWhrblDofSmvt_NYd8w0DOMc-PyEoMa4cb0QI-2WhA'
    );
    easeapi.setRefreshToken(
      'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.eK7GvORol8AX06S5394jraGorLfF98IM8Nv6EL5pOl_JxNm7ua00phS_c_WdNuofwo7WmbwQflEorDuJv0FVf8W0mxwTl3GGN2g7Rc04r340KTEUY1NnPrwlhIOhy-yBk-gBlNLaKkuiilhufFKK-tjlSeFqTa1URK15qVsVt8LCA4O_FdI0OMcsW7UbQwsxdD0BZq6f-uxImt5WFT_oa8sWslxrwbal1zE_wqCp9Mz8GZcR8W_8vEa8ky5xNnd2X9uGGkidOqprKrGzXNY8a0alFSETKKElsJwmIsmQT0BJ9I22tREy4u_vFdoqFSpIViYDqAFdo9gePSpdipLThA.G_MNEKrl2yBzjsBJ.HUKB8DMJp89MWmca8hKgRuigPb1reVWydEbXI36C_KBwtgbyPnk17f771ZiGqEPN7ngxnqI7w5fxBRcYYb9kbyD1MME6rzX1t8qOp9NUU8v1Xqhs_7DmZAkw6cHFx2i5krQCxXCVtOyBvZ-QLFs56b74r7Y1Wap43weKZRbDqWTN9HlE6H4JcX5szSFZhdz87pA2Yin-cIfamVUO5pjOsIvrUGruVEz2Sofi9GYCxpMn2EQySgpn3Qw33jTJYZbRu0zU69mxlJA--CCV52-QXV6_sarMeH0qSorntpj2EvpByyX8Sc3YM6w1yQaiYlJblDTY5qssopeBmVp6qSZs7krGizTkbusuvZHo32Tn4Cws8caZp6GgQnmrBYR9P9LAtVfRDucKIMS_wNUQuhw8y924FUX0ZVt2QWLF7CpHLheov8zuok4bMb78mc03OeJf85V0NodCDeyZ9JXn1vvlxak0cQlW8JTVc-eT1sPNqbYCwHevK2fJZUM31jNRqGtvhIM4cLO3IetCrL7GEfF7UKe5x2HoAP1deefbWX_pXFalnunD17UGGwu66qVVvM_9j5milUONp6BR_KwxvuBBdr74-zah3pJ1k8VKN6T6ZOVJJNO0rP-_n2BjwS1fv08e47rwER5Z7horIh0X_bdF0PbA1Q-LqJgX9ZpS2zgO5yNoXEvQ8VuZ62q3z7w3JSrT6qwM2TdsEmiw24uP6VM6V9YSsF1j-jmS14L5X1wt5kQq9zMyeSjreQ7Kly4wYT9mIzhJoQc1XiN5xjGDpxPM9BRgpj8NIMvMvNEtjJqVPA3CwpUdm32Kejx4lypiqJzmcY0jexkvFGlPYTUiT2ImHy6vJTUI4BcTuIEw25Tyf9HpccQnYF4zIXcBhtAo5UOTriLVxCyoPEGjiL2d48TleqySbfsF2S5mBmhxG8SP4Pto0La5BNjElvalHn3kY29XERROTm2YkVAZsnBabjhlFaPL-WPN7TneBmWIYo211Lk9e9D-qag7_B_dKIp6axSRP3d3J4I5rtJqEKxImIfMZSxw_OsWCQCNQ8XYXtu7LxxTBWVSSGPyzVpQxDSi6ynJvgotKrrkMGHZniszVIS65NvudWsDki-x1OMlNNmO0eaJTOyEO1MFk35xnk0IBHAb8RVDNe-93c9jyYD4qRT8QrbvYI8jRnOmCLfgEU24Pf3nXqM7AghYRHaFSeUPoRU3Z1pfKP8RciHwTfU8UpMsQWdtNXk0X3sna0PKQ7yEabYl2pTFFxB6WZETx2g4pVi1WFEr7mhqNA.s8w141Y231aghl5VELd8Lw'
    );

    // Market Overview
    console.log('\n📊 Fetching Market Overview');
    console.log('=========================');

    // Get User Profile
    console.log('\nFetching User Profile...');
    const profile = await easeapi.get_user_profile();
    console.log('User Profile:', JSON.stringify(profile, null, 2));

    // Get Fund Details
    console.log('\nFetching Fund Details...');
    const funds = await easeapi.get_fund_details();
    console.log("Available Funds:", JSON.stringify(funds, null, 2));

    // Get Instruments
    console.log('\nFetching Instruments...');
    const instruments = await easeapi.get_instruments();
    console.log(`Total Instruments: ${instruments.length}`);

    const demoInstruments = getDemoInstruments(instruments);
    console.log('\n🎉 Selected Instruments for Demo:');
    console.table(demoInstruments);

    // Trading Operations
    console.log('\n💹 Trading Operations');
    console.log('===================');

    // 1. Place Order (Cash Segment)
    console.log('\n💵💵💵 Placing Cash Order...');
    const deliveryOrder = await easeapi.place_delivery_order({
      // instrument_id: RELIANCE NSE
      instrument_id: Number(demoInstruments[0]['Instrument ID']),
      exchange: 'NSE',
      segment: 'E',            // E for Equity
      transaction_type: 'B',
      order_type: 'MKT',       // Market order
      quantity: 1,
      price: 0.0,
      trigger_price: 0.0,
      product: 'C',            // C for Cash and Carry
      validity: 'DAY',
      disclosed_quantity: 0,
      off_market_flag: 0,
    });
    console.log('Delivery Order Response:', JSON.stringify(deliveryOrder, null, 2));

    // 2. Place NSE FUT Order (NSE F&O Segment)
    console.log('\n💵💵💵 Placing NSE FUT Order...');
    const nseDerivativeOrder = await easeapi.place_delivery_order({
      // instrument_id: RELIANCE FUT exchange token
      instrument_id: Number(demoInstruments[2]['Instrument ID']),
      exchange: 'NSE',
      segment: 'D',            // D for F&O
      transaction_type: 'B',
      order_type: 'MKT',       
      quantity: Number(demoInstruments[2]['Lot Size']),
      price: 0.0,
      trigger_price: 0.0,
      product: 'M',            // M for margin
      validity: 'DAY',
      disclosed_quantity: 0,
      off_market_flag: 0,
    });
    console.log('Delivery NSE FUT Order Response:', JSON.stringify(nseDerivativeOrder, null, 2));

    // 3. Place NSE Call Option Order (NSE F&O Segment)
    console.log('\n💵💵💵 Placing NSE Call Option Order...');
    const nseCEDerivativeOrder = await easeapi.place_delivery_order({
      // instrument_id: RELIANCE CE exchange token
      instrument_id: Number(demoInstruments[3]['Instrument ID']),
      exchange: 'NSE',
      segment: 'D',           // D for F&O
      transaction_type: 'B',
      order_type: 'MKT',
      quantity: Number(demoInstruments[3]['Lot Size']),
      price: 0.0,
      trigger_price: 0.0,
      product: 'M',           // M for margin
      validity: 'DAY',
      disclosed_quantity: 0,
      off_market_flag: 0,
    });
    console.log('Delivery NSE Call Option Order Response:', JSON.stringify(nseCEDerivativeOrder, null, 2));

    // 4. Place NSE Put Option Order (NSE F&O Segment)
    console.log('\n💵💵💵 Placing NSE Put Option Order...');
    const nsePEDerivativeOrder = await easeapi.place_delivery_order({
      // instrument_id: RELIANCE PE exchange token
      instrument_id: Number(demoInstruments[4]['Instrument ID']),
      exchange: 'NSE',
      segment: 'D',           // D for F&O
      transaction_type: 'B',
      order_type: 'MKT',
      quantity: Number(demoInstruments[4]['Lot Size']), // lot size
      price: 0.0,
      trigger_price: 0.0,
      product: 'M',           // M for margin
      validity: 'DAY',
      disclosed_quantity: 0,
      off_market_flag: 0,
    });
    console.log('Delivery NSE Put Option Order Response:', JSON.stringify(nsePEDerivativeOrder, null, 2));

    // 5. Place Intraday Order (Cash Segment)
    console.log('\n💵💵💵 Placing Intraday Equity Order...');
    const intradayOrder = await easeapi.place_intraday_order({
      // instrument_id: RELIANCE NSE
      instrument_id: Number(demoInstruments[0]['Instrument ID']),
      exchange: 'NSE',
      segment: 'E',            // E for Equity
      transaction_type: 'B',
      order_type: 'LMT',       // Limit order
      quantity: 1,
      price: Number(demoInstruments[0]['Last Price']), // RELIANCE NSE Last Price
      trigger_price: 0.0,
      product: 'I',            // I for Intraday
      validity: 'DAY',
      disclosed_quantity: 0,
      off_market_flag: 0,
    });
    console.log('Intraday Order Response:', JSON.stringify(intradayOrder, null, 2));

    // Modify Existing Order
    console.log('\nModifying Order...');
    const modifyOrder = await easeapi.modify_order({
      order_type: 'LMT',       // Limit order
      quantity: 1,
      price: Number(demoInstruments[0]['Last Price']), // RELIANCE NSE Last Price
      trigger_price: 0.0,
      disc_quantity: 0,
      order_no: intradayOrder.order_no, // Using order_no from the intraday order response
      validity: 'DAY',
    });
    console.log('Modify Order Response:', JSON.stringify(modifyOrder, null, 2));

    // Cancel Existing Order
    console.log('\nCancelling Order...');
    const cancelOrder = await easeapi.cancel_order({
      order_no: intradayOrder.order_no,
    });
    console.log('Cancel Order Response:', JSON.stringify(cancelOrder, null, 2));

    // Portfolio Management
    console.log('\n📈 Portfolio Management');
    console.log('=====================');

    // Get Trade Book
    console.log('\nFetching Trade Book...');
    const tradeBook = await easeapi.get_tradebook();
    console.log('Trade Book:', JSON.stringify(tradeBook, null, 2));

    // Get Positions
    console.log('\nFetching Positions...');
    const positions = await easeapi.get_positions();
    console.log('Positions:', JSON.stringify(positions, null, 2));

    // Get Order Book
    console.log('\nFetching Order Book...');
    const orderBook = await easeapi.get_orderbook();
    console.log('Order Book:', JSON.stringify(orderBook, null, 2));

    // Get Holdings
    console.log('\nFetching Holdings...');
    const holdings = await easeapi.get_holdings();
    console.log('Holdings:', JSON.stringify(holdings, null, 2));

    // Cleanup and Logout
    console.log('\n👋 Wrapping Up Session');
    console.log('===================');
    await easeapi.logout();
    console.log('✅ Successfully logged out. Thank you for using EaseAPI!');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.error(
        "\n❌ Oops! 400 Bad Request: Please check your auth_token, client_id or request_token based on the failing API. 💡\nMessage:",
        error.response.data.message
      );
    } else {
      console.error("\n❌ Oops! Something went wrong:", error.message);
      if (error.stack) {
        console.error("\nTechnical Details:");
        // console.error(error.stack);
      }
    }
  }
}

/**
 * Filters and selects demo instruments from the full instruments array.
 * Returns an array of instrument objects used for the demo.
 */
function getDemoInstruments(instruments) {
  const relianceInstruments = instruments.filter(
    (inst) =>
      (inst.name && inst.name.trim() === 'RELIANCE') ||
      (inst.trading_symbol && inst.trading_symbol.trim().includes('RELIANCE'))
  );

  const reliance_nse_eq = relianceInstruments.find(
    (inst) => inst.exchange && inst.exchange.trim() === 'NSE'
  );
  const reliance_bse_eq = relianceInstruments.find(
    (inst) => inst.exchange && inst.exchange.trim() === 'BSE'
  );
  const reliance_FUT = relianceInstruments.find(
    (inst) =>
      inst.instrument &&
      inst.instrument.trim() === 'FUT' &&
      Number(inst.last_price) !== 0
  );
  const reliance_CE = relianceInstruments.find(
    (inst) =>
      inst.instrument &&
      inst.instrument.trim() === 'CE' &&
      Number(inst.last_price) !== 0
  );
  const reliance_PE = relianceInstruments.find(
    (inst) =>
      inst.instrument &&
      inst.instrument.trim() === 'PE' &&
      Number(inst.last_price) !== 0
  );

  return [
    {
      Type: 'RELIANCE NSE EQ',
      'Trading Symbol': reliance_nse_eq?.trading_symbol,
      'Instrument ID': reliance_nse_eq?.exchange_token,
      'Last Price': reliance_nse_eq?.last_price,
      'Lot Size': reliance_nse_eq?.lot_size,
    },
    {
      Type: 'RELIANCE BSE EQ',
      'Trading Symbol': reliance_bse_eq?.trading_symbol,
      'Instrument ID': reliance_bse_eq?.exchange_token,
      'Last Price': reliance_bse_eq?.last_price,
      'Lot Size': reliance_bse_eq?.lot_size,
    },
    {
      Type: 'RELIANCE FUT',
      'Trading Symbol': reliance_FUT?.trading_symbol,
      'Instrument ID': reliance_FUT?.exchange_token,
      'Last Price': reliance_FUT?.last_price,
      'Lot Size': reliance_FUT?.lot_size,
    },
    {
      Type: 'RELIANCE CE',
      'Trading Symbol': reliance_CE?.trading_symbol,
      'Instrument ID': reliance_CE?.exchange_token,
      'Last Price': reliance_CE?.last_price,
      'Lot Size': reliance_CE?.lot_size,
    },
    {
      Type: 'RELIANCE PE',
      'Trading Symbol': reliance_PE?.trading_symbol,
      'Instrument ID': reliance_PE?.exchange_token,
      'Last Price': reliance_PE?.last_price,
      'Lot Size': reliance_PE?.lot_size,
    },
  ];
}

// Start the demo
console.log('🎯 Initializing EaseAPI Demo...');
demonstrateEaseAPICapabilities()
  .then(() => console.log('\n🎉 Demo completed successfully!'))
  .catch((error) =>
    console.error('\n❌ Demo encountered an error:', error.message)
  );
