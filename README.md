# Brewhaus Project

## Development

### Running the Project

In both the client and the server directories, execute this command:

`npm run dev`

## Features

### Required

- ✅ Main page listing out breweries
- ✅ Pagination or lazy loading of breweries
  - Implemented as a lazy-loaded Infinite Scroll
- ✅ Simple search function of breweries
- ✅ Details page where a user can find out more information about specific breweries
  - Implemented as a popup modal when selecting a list entry
  - 🔎 To add: standalone page accessed when selecting favorited breweries- this is already partially implemented as the modal component contains a page component for separation of concerns

### Extension

- ✅ Mobile-app ready UI
- 🔎 Filters available on List page
- 🔎 Save Favorite Breweries
- 🔎 Settings Menu to Switch Between Pagination/Infinite Scroll
- 🔎 Random Images for each Brewery
  - as placeholders for if the hypothetical company's API supported photos of the business
- 🔎 Lat/Lon Maps Display
- 🔎 Capacitor Integration

## Stack

### Client

- **Vue 3**
  - for app flow and logic
- **tailwind**
  - for clean css styles out of the box
  - ***daisyUI***: for common mobile components built using tailwind css
- **Apollo Client**
  - for connecting to graphql

### Server

- Node
- Express
- GraphQL
- Apollo Server
  - GraphQL server

### Mobile Packaging

- Capacitor
