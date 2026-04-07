import { gqlBrewery } from '@brewhaus/shared/types/graphql';
import { ApiBrewery } from '../services/api/types';

export function mapApiBrewery(response: ApiBrewery): gqlBrewery {
    return {
        id: response.id,
        name: response.name,
        breweryType: response.brewery_type,
        address1: response.address_1,
        address2: response.address_2,
        address3: response.address_3,
        city: response.city,
        stateProvince: response.state_province,
        postalCode: response.postal_code,
        country: response.country,
        longitude: response.longitude,
        latitude: response.latitude,
        phone: response.phone,
        websiteUrl: response.website_url,
    };
}
