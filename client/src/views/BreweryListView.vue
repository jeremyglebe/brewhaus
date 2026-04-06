<template>
  <!-- min-h-screen = minimum height = 100vh (full viewport height)
       bg-base-200 = daisyUI "page background" color (slightly gray surface) -->
  <main class="min-h-screen bg-base-200">

    <!-- container = responsive width container
         mx-auto = center horizontally using auto left/right margins
         max-w-2xl = max width ~672px (keeps content readable on large screens)
         p-4 = padding on all sides = 1rem (16px) -->
    <section class="container mx-auto max-w-2xl p-4">

      <!-- hero = daisyUI layout component for headers/sections
           rounded-box = theme-based rounded corners
           bg-base-100 = primary surface color (white in light mode)
           shadow-sm = small drop shadow
           mb-6 = margin-bottom = 1.5rem (24px) -->
      <div class="hero rounded-box bg-base-100 shadow-sm mb-6">

        <!-- hero-content = standard inner layout container for hero -->
        <div class="hero-content w-full justify-start">

          <div>
            <!-- text-3xl = large font size (~30px)
                 font-bold = bold font weight -->
            <h1 class="text-3xl font-bold">Brewhaus</h1>

            <!-- text-base-content/70 = base text color at 70% opacity (muted text) -->
            <p class="text-base-content/70">
              Browse breweries from the Brewhaus directory.
            </p>
          </div>

        </div>
      </div>

      <!-- alert = daisyUI alert component
           alert-info = informational styling (blue-ish)
           shadow-sm = subtle elevation -->
      <div v-if="loading" class="alert alert-info shadow-sm">
        <span>Loading breweries...</span>
      </div>

      <!-- alert-error = error styling (red colors) -->
      <div v-else-if="errorMessage" class="alert alert-error shadow-sm">
        <span>{{ errorMessage }}</span>
      </div>

      <!-- space-y-4:
           adds vertical spacing between ALL direct children
           "y" = vertical axis (top/bottom)
           "4" = 1rem (16px) spacing -->
      <div v-else class="space-y-4">

        <!-- card = daisyUI card component
             bg-base-100 = card background surface
             shadow-sm = small elevation -->
        <div v-for="brewery in breweries" :key="brewery.id" class="card bg-base-100 shadow-sm">

          <!-- card-body = standard padding + layout inside card -->
          <div class="card-body">

            <!-- card-title = styled heading inside card -->
            <h2 class="card-title">{{ brewery.name }}</h2>

            <!-- text-base-content/70 = muted text color -->
            <p class="text-base-content/70">
              {{ brewery.city }}
              <span v-if="brewery.stateProvince">
                , {{ brewery.stateProvince }}
              </span>
            </p>

            <!-- card-actions = layout row for buttons/badges
                 justify-start = align items to the left -->
            <div class="card-actions justify-start">

              <!-- badge = daisyUI badge component
                   badge-outline = outlined style instead of filled -->
              <div class="badge badge-outline">
                {{ brewery.breweryType || 'Unknown type' }}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { gql } from '@apollo/client';
import { onMounted, ref } from 'vue';
import { apolloClient } from '../lib/apollo';

type Brewery = {
  id: string;
  name: string;
  city: string | null;
  stateProvince: string | null;
  breweryType: string | null;
};

type GetBreweriesResult = {
  breweries: {
    items: Brewery[];
  };
};

const GET_BREWERIES = gql`
  query GetBreweries($page: Int!, $perPage: Int!) {
    breweries(page: $page, perPage: $perPage) {
      items {
        id
        name
        city
        stateProvince
        breweryType
      }
    }
  }
`;

// Reactive state variables
const breweries = ref<Brewery[]>([]);
const loading = ref(true);
const errorMessage = ref<string | null>(null);

// Lifecycle hook when the view is entered
onMounted(async () => {
  // query the breweries from the GraphQL API
  try {
    const { data } = await apolloClient.query<GetBreweriesResult>({
      query: GET_BREWERIES,
      variables: {
        page: 1,
        perPage: 12,
      },
    });

    if (!data) {
      throw new Error('No data returned from breweries query');
    }

    breweries.value = data.breweries.items;
  }
  // handle any errors that occur during the query
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error';
  }
  // flag that loading is complete regardless of success or failure
  finally {
    loading.value = false;
  }
});
</script>
