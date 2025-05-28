// API endpoints
 API = {
    root_uri: 'https://easeapi.venturasecurities.com',
    debug: false,
    timeout: 7000,
    
	login_url : '/auth/v1/login',
	generate_auth_token: '/login/v1/authorization/token',
    get_instruments: '/instrument/v1/instruments',
    get_user_profile: '/user/v1/profile',
    get_fund_details: '/user/v1/fund_details',
	place_delivery_order: '/trade/v1/delivery',
    place_intraday_order: '/trade/v1/intraday/regular',
    modify_order: '/trade/v1/modify',
    cancel_order: '/trade/v1/cancel',
    get_orderbook: '/trade/v1/orders',
    get_tradebook: '/trade/v1/trades',
	holdings: '/portfolio/v1/holdings',
	positions: '/portfolio/v1/positions',
	logout: '/user/v1/logout'
};

function getWithRootUrl(endpoint) {
    return `${API.root_uri}${endpoint}`;
}


// Exporting both ants and API
module.exports = {
    API,
	getWithRootUrl  
};
