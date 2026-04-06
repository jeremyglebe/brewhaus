// the functions that answer queries

const mockBreweries = [
    {
        id: 'brewery-1',
        name: 'Mock Brewing Co.',
        breweryType: 'micro',
        address1: '123 Main St',
        address2: null,
        address3: null,
        city: 'Austin',
        stateProvince: 'Texas',
        postalCode: '78701',
        country: 'United States',
        longitude: -97.7431,
        latitude: 30.2672,
        phone: '5551234567',
        websiteUrl: 'https://example.com',
    },
    {
        id: 'brewery-2',
        name: 'River House Brewery',
        breweryType: 'brewpub',
        address1: '456 River Rd',
        address2: null,
        address3: null,
        city: 'Denver',
        stateProvince: 'Colorado',
        postalCode: '80202',
        country: 'United States',
        longitude: -104.9903,
        latitude: 39.7392,
        phone: '5559876543',
        websiteUrl: 'https://riverhouse.example.com',
    },
];

export const resolvers = {
    // corresponds with the Query type in the schema
    Query: {
        // handles query breweries(page: Int, perPage: Int, search: String)
        breweries: (_parent: unknown, args: { page?: number; perPage?: number; search?: string | null }) => {
            // Default values optional arguments
            const page = args.page ?? 1;
            const perPage = args.perPage ?? 12;

            // Cleaning arguments
            const search = args.search?.trim().toLowerCase() ?? '';

            // Fetching the results (temporarily mock)
            let items = mockBreweries;
            if (search) {
                items = items.filter((brewery) => brewery.name.toLowerCase().includes(search));
            }

            // Return the data in the shape of BreweryListResult
            return {
                items,
                page,
                perPage,
                hasNextPage: false,
            };
        },

        // handles query brewery(id: ID!)
        brewery: (_parent: unknown, args: { id: string }) => {
            return mockBreweries.find((brewery) => brewery.id === args.id) ?? null;
        },
    },
};
