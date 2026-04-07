<template>
  <div class="collapse collapse-arrow bg-base-100 shadow-sm mb-4">
    <input type="checkbox" />
    <div class="collapse-title text-base font-semibold">Filter Breweries</div>
    <div class="collapse-content pt-0">

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <!-- Brewery Type -->
        <label class="form-control w-full">
          <div class="label pb-1 pt-0">
            <span class="label-text">Type</span>
          </div>
          <select v-model="draft.byType" class="select select-bordered select-sm w-full">
            <option :value="null">Any type</option>
            <option v-for="opt in breweryTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>

        <!-- State -->
        <label class="form-control w-full">
          <div class="label pb-1 pt-0">
            <span class="label-text">State / Province</span>
          </div>
          <input
            v-model.trim="draft.byState"
            type="text"
            placeholder="e.g. California"
            class="input input-bordered input-sm w-full"
          />
        </label>

        <!-- Country -->
        <label class="form-control w-full">
          <div class="label pb-1 pt-0">
            <span class="label-text">Country</span>
          </div>
          <input
            v-model.trim="draft.byCountry"
            type="text"
            placeholder="e.g. United States"
            class="input input-bordered input-sm w-full"
          />
        </label>
      </div>

      <div class="card-actions justify-end mt-3 gap-2">
        <button type="button" class="btn btn-ghost btn-sm" @click="onClear">Clear</button>
        <button type="button" class="btn btn-primary btn-sm" @click="onApply">Apply</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { BreweryType } from '@brewhaus/shared/types/enums';
import type { BreweryListFilters } from '@/types/graphql';

const emit = defineEmits<{
  (e: 'apply', filters: BreweryListFilters): void;
  (e: 'clear'): void;
}>();

// Human-readable labels for each enum value in the dropdown.
const breweryTypeOptions: { value: BreweryType; label: string }[] = [
  { value: BreweryType.Micro, label: 'Micro' },
  { value: BreweryType.Nano, label: 'Nano' },
  { value: BreweryType.Regional, label: 'Regional' },
  { value: BreweryType.Brewpub, label: 'Brewpub' },
  { value: BreweryType.Large, label: 'Large' },
  { value: BreweryType.Planning, label: 'Planning' },
  { value: BreweryType.Bar, label: 'Bar' },
  { value: BreweryType.Contract, label: 'Contract' },
  { value: BreweryType.Proprietor, label: 'Proprietor' },
  { value: BreweryType.Closed, label: 'Closed' },
];

// Draft state is local to this component; the parent only receives finalized values on Apply.
const draft = reactive<BreweryListFilters>({
  byType: null,
  byState: null,
  byCountry: null,
});

function onApply(): void {
  // Emit a plain object snapshot so the parent isn't coupled to the reactive draft.
  emit('apply', {
    byType: draft.byType || null,
    byState: draft.byState || null,
    byCountry: draft.byCountry || null,
  });
}

function onClear(): void {
  draft.byType = null;
  draft.byState = null;
  draft.byCountry = null;
  emit('clear');
}
</script>
