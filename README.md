  # 🚀 EaseAPI Node.js SDK

  [![npm version](https://badge.fury.io/js/easeapi.svg)](https://badge.fury.io/js/easeapi)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  > The official Node.js client for communicating with [EaseAPI](https://easeapi.venturasecurities.com) - Your gateway to complete investment and trading solutions.

  ## ✨ Features

  - 🔐 Secure authentication flow
  - 📊 Real-time order execution
  - 💼 Portfolio management
  - 📈 Market data access
  - 🔄 Order modification and cancellation
  - 📱 User profile management

  ## 📦 Installation

  > 🔜 Coming Soon! The EaseAPI SDK will be available on npm shortly.
  > 
  > Once published, you'll be able to install it using:
  ```bash
  npm install ventura-easeapi
  # or
  yarn add ventura-easeapi
  ```

  > ⭐️ Star this repository to get notified when we publish the SDK!

  ## 🚀 Quick Start

  1. **Register for API Keys**
    - Visit [EaseAPI Portal](https://easeapi.venturasecurities.com/portal)
    - Create an account and obtain your `app_key` and `secret_key`

  2. **Initialize the SDK**

  ```javascript
  const { EaseApiGateway } = require("./lib");

  const easeapi = new EaseApiGateway({
    app_key: "YOUR_APP_KEY",
  });
  ```

  ## 🔑 Authentication Flow

  ```javascript
  // Step 1: Generate SSO URL
  const sso_url = easeapi.getSsoUrl("STATE_VARIABLE");

  // Step 2: Generate auth token
  await easeapi.generate_auth_token("YOUR_REQUEST_TOKEN", "YOUR_SECRET_KEY");

  // Step 3: Set credentials
  easeapi.setClientId("YOUR_CLIENT_ID");
  easeapi.setAuthToken("GENERATED_AUTH_TOKEN");
  easeapi.setRefreshToken("GENERATED_REFRESH_TOKEN");
  ```

  ## 💡 Usage Examples

  ### 👤 Get User Profile
  ```javascript
  const profile = await easeapi.get_user_profile();
  console.log(profile);
  ```

  ### 📈 Place Delivery Order
  ```javascript
  const orderResponse = await easeapi.place_delivery_order({
    instrument_id: 2885,
    exchange: "NSE",
    segment: "E",
    transaction_type: "B",
    order_type: "MKT",
    quantity: 1,
    price: 1224.0,
    product: "C",
    validity: "DAY"
  });
  ```

  ## 📚 Documentation

  For detailed API documentation and more examples:
  - [EaseAPI Documentation](https://easeapi.venturasecurities.com/docs)
  - [Sample Code](run_apis.js)

  ## 🧪 Running Examples

  ```bash
  npm install
  npm run start
  ```

  ## 📄 License

  This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

  ---

  ⭐️ If you find this SDK helpful, please consider giving it a star on GitHub!

  _Built with ❤️ by Engineering at [Ventura Securities Ltd.](https://www.ventura1.com)_
