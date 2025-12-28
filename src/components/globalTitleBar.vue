<!--
/*
 * File: globalTitleBar.vue
 * Project: wardrobe
 * Created Date: 2025-12-28 15:07:43
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-28 15:33:30
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

    <!-- Wardrobe Icon -->
    <NuxtLink class="absolute left-12.5 lg:left-7.5 select-none z-20 cursor-pointer transition-opacity duration-500" to="/">
        <img src="/logo.png" class="h-7.5">
    </NuxtLink>

    <!-- Right side -->
    <div class="absolute flex w-full justify-end pr-3 gap-4 select-none">
        <!-- Search input. Use click.prevent to prevent click from passing through and thus preventing search bar from expanding -->
        <div
            class="flex rounded-xl shadow-md bg-bg-field-light dark:bg-bg-field-dark transition-all"
            type="search"
            @click.stop="showGlobalSearchBar()"
        >                                                                                       <!-- bg-bg-input-light dark:bg-bg-input-dark hover:bg-bg-input-hover-light dark:hover:bg-bg-input-hover-dark outline-border-secondary-light dark:outline-border-secondary-dark outline-2 -->
            <PhMagnifyingGlass class="self-center mx-2 size-5"></PhMagnifyingGlass>
            <input
                ref="globalSearchInput"
                class="w-0 py-1 outline-0 transition-all"
                :class="globalSearchStr != null ? 'w-25 sm:w-40 md:w-50' : 'invisible w-0'"
                placeholder="Search"
                type="search"
                v-model.trim="globalSearchStr"
            />
        </div>

        <!-- Light/Dark Mode toggle. "p-0.5!" overwrites custom-button-icon-only's p-1 to make button smaller -->
        <button class="custom-button-icon-only p-0.5!" @click="toggleDarkMode()">
            <!-- This must tailwind tags instead of nuxt refs in order to work on page load (see global.js) -->
            <PhMoon class="hidden dark:block size-7 p-0.5 transition-opacity"></PhMoon>
            <PhSun class="block dark:hidden size-7 p-0.5 transition-opacity"></PhSun>
        </button>
    </div>

</template>


<script setup lang="ts">
    import { PhMoon, PhSun, PhMagnifyingGlass } from "@phosphor-icons/vue";

    const globalSearchInput = useTemplateRef("globalSearchInput");
    const globalSearchStr:  Ref<string|null> = useState("globalSearchStr", () => null); // null on page load, set to "" on click to expand input

    // Global mouse event listener to collapse search input when clicking anywhere while search bar is empty
    callOnce(() => {
        console.log("DEBUG - globalTitleBar: Attaching mouse event listener")

        document.addEventListener("mouseup", () => {
            if (globalSearchStr.value === "") {
                globalSearchStr.value = null;
            }
        });
    });

    // Sets globalSearchStr to !null to expand search bar and sets focus
    function showGlobalSearchBar() {
        globalSearchStr.value = globalSearchStr.value || "";

        // Wait a moment as we cannot focus the non-expanded input. nextTick() is not enough
        setTimeout(() => {
            globalSearchInput.value!.focus();
        }, 50);
    }

    // Toggles dark mode
    function toggleDarkMode() {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("darkModeEnabled", String(isDark));
    }

    // Define Props to be accepted by this component
    defineProps({
        backRedirectTo: { // Leave empty to disable back button
            type: String,
            required: false
        }
    });

</script>
