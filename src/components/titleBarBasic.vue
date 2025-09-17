<!--
/*
 * File: titleBarBasic.vue
 * Project: wardrobe
 * Created Date: 2025-09-17 17:25:36
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-17 21:52:04
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

    <div id="title" class="flex w-full select-none">
        <div class="flex justify-start" v-if="backRedirectTo">
            <NuxtLink :to="backRedirectTo" class="flex items-center justify-center h-8 py-1 px-3 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                <PhCaretLeft class="size-5 text-text-light dark:text-text-dark"></PhCaretLeft>
            </NuxtLink>
        </div>

        <div class="flex w-full justify-end">
            <div class="h-8 py-1 px-3 rounded-md shadow-md cursor-pointer bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                <slot></slot>
            </div>
        </div>
    </div>

</template>


<script setup lang="ts">
    import { PhCaretLeft } from "@phosphor-icons/vue";

    // Define Props to be accepted by this component
    defineProps({
        backRedirectTo: { // Leave empty to disable back button
            type: String,
            required: false
        }
    });

</script>
