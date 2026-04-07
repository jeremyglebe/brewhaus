// it may be useful to know what default values are used by the api in other parts of the code
const API_CONSTANTS = Object.freeze({
    base_url: 'https://api.openbrewerydb.org/v1/breweries',
    defaults: {
        page: 1,
        per_page: 50,
    },
    maximums: {
        per_page: 200,
    },
});

export default API_CONSTANTS;
