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
  - Standalone page accessed via route params- the modal contains an "open full page" button

### Extension

- ✅ Mono-repo setup with shared project
- ✅ Mobile-app ready UI
- ✅ Filters available on List page
- ✅ Save Favorite Breweries
  - ✅ Route to the standalone page when accessed from the favorites menu
- ✅ Settings Menu to Switch Between Pagination/Infinite Scroll
  - ✅ Implement Pagination version of the List Page
- ✅ Random Images for each Brewery
  - Images are being used as placeholders; the images are not actually of the business or even brewery-related
  - Imagine the hypothetical company's API supported photos of the business, this demonstrates how it may be displayed
- ✅ Lat/Lon Maps Display
  - Implemented via Google Maps iFrame (rather than api integration); minimal map features for demonstration only
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
- Setup and workflow docs: [client/README.md](client/README.md#capacitor-integration)

### Geolocation Permissions

Capacitor geolocation requires native platform permissions:

- iOS privacy strings are configured in [client/ios/App/App/Info.plist](client/ios/App/App/Info.plist)
- Android location permissions are configured in [client/android/app/src/main/AndroidManifest.xml](client/android/app/src/main/AndroidManifest.xml)
