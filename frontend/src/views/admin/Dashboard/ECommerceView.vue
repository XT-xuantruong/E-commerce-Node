<script setup lang="ts">
import DataStatsOne from '@/components/admin/DataStats/DataStatsOne.vue'
import TableOrder from '@/components/admin/Tables/TableOrder.vue'
import DefaultLayout from '@/layouts/admin/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5"
    >
      <DataStatsOne />
    </div>

    <div
      class="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"
    >
      <h1 class="text-3xl">Order</h1>
      <TableOrder />
    </div>
  </DefaultLayout>
</template>
