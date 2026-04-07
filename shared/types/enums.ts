export enum BreweryType {
    // Most craft breweries. For example, Samual Adams is still considered a micro brewery.
    Micro = 'micro',
    // An extremely small brewery which typically only distributes locally.
    Nano = 'nano',
    // A regional location of an expanded brewery. Ex. Sierra Nevada’s Asheville, NC location.
    Regional = 'regional',
    // A beer-focused restaurant or restaurant/bar with a brewery on-premise.
    Brewpub = 'brewpub',
    // A very large brewery. Likely not for visitors. Ex. Miller-Coors. (deprecatedated)
    Large = 'large',
    // A brewery in planning or not yet opened to the public.
    Planning = 'planning',
    // A bar. No brewery equipment on premise. (deprecatedated)
    Bar = 'bar',
    // A brewery that uses another brewery’s equipment.
    Contract = 'contract',
    // Similar to contract brewing but refers more to a brewery incubator.
    Proprietor = 'proprietor',
    // A location which has been closed.
    Closed = 'closed',
}

export enum SortDirection {
    Ascending = 'asc',
    Descending = 'desc',
}
