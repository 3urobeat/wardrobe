<!--
/*
 * File: outfits.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:40:46
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-08 19:17:31
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>
    <div id="title" class="absolute w-full right-5 mb-5 lg:mb-7 pt-10 select-none">
        <!-- Add button -->
        <div class="flex justify-end items-center">
            <NuxtLink to="/outfits/add" class="flex items-center justify-center py-1 px-3 rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                <PhPlus class="mr-2 size-5 text-green-600"></PhPlus>
                Add Outfit
            </NuxtLink>
        </div>
    </div>

    <div class="text-center lg:flex lg:flex-col lg:mx-12"> <!-- Offset content to the right on desktop -->
    </div>
</template>


<script setup lang="ts">
    import { PhPlus } from "@phosphor-icons/vue";
    import type { Item } from "~/model/item";


    // Cache
    const storedItems: Ref<Item[]> = ref(null!);


    // Get all clothing and their details on load
    let res = await useFetch<Item[]>("/api/get-all-items");


    // Redirect to add page
    async function addItem() {

    }

</script>
