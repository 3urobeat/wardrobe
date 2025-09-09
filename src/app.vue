<!--
/*
 * File: app.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:54:21
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-09 17:09:39
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
    <div class="flex flex-col h-screen bg-bg-light dark:bg-bg-dark">
        <!-- Title bar -->
        <PhList :class="!showNavbar ? 'block' : 'opacity-0'" class="fixed z-30 cursor-pointer left-3 top-4.5 dark:text-text-dark lg:hidden block transition-opacity" size="25px" @click="showNavbar = !showNavbar"></PhList>
        <PhCaretLeft :class="showNavbar ? 'block' : 'opacity-0'" class="fixed z-30 cursor-pointer left-3 top-4.5 dark:text-text-dark lg:hidden block transition-opacity" size="25px" @click="showNavbar = !showNavbar"></PhCaretLeft>

        <header
            id="titlebar"
            :class="showNavbar ? 'border-opacity-30 lg:border-opacity-100 dark:text-text-dark lg:opacity-100 lg:dark:opacity-100' : ''"
            class="flex justify-center items-center shrink-0 h-15 dark:text-text-dark border-y-1 border-y-border-primary-light dark:border-y-border-primary-dark border-t-0 transition-all duration-500"
        >                                                                                                                                                 <!-- The extra lg: tags in :class fix a bg color bug when the window is resized while the navbar was open. The opacities are applied seperately here to avoid page elements fading through -->
            <!-- Title -->
            <div :class="showNavbar ? 'opacity-30 lg:opacity-100' : ''" class="fixed flex justify-center items-center select-none font-semibold transition-opacity duration-500">
                <PhDresser class="mr-2 size-5"></PhDresser>
                Wardrobe
            </div>

            <!-- Light/Dark Mode toggle -->
            <div class="w-full pr-3 select-none flex justify-end font-semibold">
                <button :class="showNavbar ? 'opacity-30 lg:opacity-100' : ''" class="rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark transition-all" @click="setDarkMode(!darkModeEnabled)">
                    <PhMoon :class="darkModeEnabled ? 'opacity-100' : 'opacity-0'" class="fixed size-7 p-0.5 transition-opacity"></PhMoon>
                    <PhSun :class="darkModeEnabled ? 'opacity-0' : 'opacity-100'" class="size-7 p-0.5 transition-opacity"></PhSun>
                </button>
            </div>
        </header>


        <!-- Group navbar and main content so that they can share the screen width -->
        <div class="flex flex-row h-full">

            <!-- Left navigation bar which offsets everything else to the right on desktop and overlays everything on mobile -->
            <nav
                id="navbar"
                :class="showNavbar ? 'backdrop-blur-sm' : 'invisible lg:visible w-0 min-w-0 opacity-0'"
                class="z-20 w-52 min-w-52 lg:relative lg:block lg:opacity-100 dark:text-text-dark border-x-1 border-x-border-primary-light dark:border-x-border-primary-dark border-l-0 select-none duration-500 transition-all"
            >

                <div class="absolute left-9 lg:top-4">
                    <div class="my-3"></div> <!-- Add some space above everything-->

                    <NuxtLink to="/" class="flex items-center px-2 py-1 mb-1 rounded-sm hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                        <span class="fixed mb-1 text-xl font-bold text-green-600" v-show="route.name === 'index'">|</span>
                        <div class="flex mx-4 items-center justify-center w-full">
                            <PhHouse class="mr-2"></PhHouse> Browse
                        </div>
                    </NuxtLink>

                    <div class="my-2 h-0.5 bg-border-secondary-light dark:bg-border-secondary-dark opacity-50"></div> <!-- Divider to give Browse more presence -->

                    <NuxtLink to="/outfits" class="flex items-center px-2 py-1 mb-1 rounded-sm hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                        <span class="fixed mb-1 text-xl font-bold text-green-600" v-show="route.name === 'outfits'">|</span>
                        <div class="flex mx-4 items-center justify-center w-full">
                            <PhCoatHanger class="mr-2"></PhCoatHanger> Outfits
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/settings" class="flex items-center px-2 py-1 mb-1 rounded-sm hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                        <span class="fixed mb-1 text-xl font-bold text-green-600" v-show="route.name === 'settings'">|</span>
                        <div class="flex mx-4 items-center justify-center w-full">
                            <PhGear class="mr-2"></PhGear> Settings
                        </div>
                    </NuxtLink>
                </div>

                <!-- Footer for project details -->
                <footer class="fixed text-nowrap bottom-0 left-0 h-fit pb-2 px-2.5">
                    <div class="flex flex-col text-xs lg:text-sm opacity-50">
                        <div :class="onlineVersion && onlineVersion != packagejson.version ? '' : 'hidden'" class="mb-4 px-1 py-0.5 bg-bg-embed-light dark:bg-bg-embed-dark outline-2 outline-border-secondary-light dark:outline-border-secondary-dark rounded-lg">
                            <p class="font-semibold">Update available!</p>
                            <p>New version: <span class="text-green-500 font-extrabold">{{ onlineVersion }}</span></p>
                            Read the patch notes <a class="underline hover:text-gray-500" :href="'https://github.com/3urobeat/wardrobe/releases/tag/' + onlineVersion" target="_blank">here!</a>
                        </div>

                        wardrobe v{{ packagejson.version }}

                        <a class="flex w-fit items-center mt-0.5 -ml-1 rounded-xl px-2 text-gray-100 bg-gray-600 hover:bg-gray-400 hover:transition-all" href="http://github.com/3urobeat/wardrobe" target="_blank">

                            <!-- GitHub logo -->
                            <svg class="mr-1" width="1em" height="1em" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                            </svg>

                            <span class="text-white rounded-lg text-xm" href="https://github.com/3urobeat/wardrobe" target="_blank">Source Code</span>

                        </a>

                        <p>Licensed under <a class="underline hover:text-gray-500" href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">GPLv3</a></p>
                        <p>Copyright (c) 2025 <a class="underline hover:text-gray-500" href="https://github.com/3urobeat" target="_blank">3urobeat</a></p>
                    </div>
                </footer>

            </nav>

            <!-- The main content itself, pushed to the side by the navbar - The extra lg: tags in :class fix a bg color bug when the window is resized while the navbar was open - The lg:pr-52 param subtracts the navbar (a bit hacky) -->
            <main
                :class="showNavbar ? 'opacity-30 dark:opacity-70 lg:opacity-100 lg:dark:opacity-100' : ''"
                class="fixed w-screen h-screen dark:text-text-dark transition-all duration-500 lg:pl-52"
                @click="showNavbar = false"
            >
                <div :class="showNavbar ? 'absolute h-screen w-screen opacity-0 lg:w-0 lg:h-0' : ''" class="z-50"></div> <!-- Dummy to prevent NuxtPage button presses when the navbar is open -->

                <!-- Page content wrapped into a border container, used to indicate success or failure for actions -->
                <div
                    id="color-border"
                    class="fixed bottom-0 top-15 right-0 lg:left-52 left-0 border-8 border-transparent rounded-2xl duration-500 overflow-auto"
                >
                    <div class="px-5 -mt-5 right-0 left-0">
                        <NuxtPage></NuxtPage> <!-- Links to index.vue -->
                    </div>
                </div>
            </main>

        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhList, PhCaretLeft, PhMoon, PhSun, PhHouse, PhGear, PhCoatHanger, PhDresser } from "@phosphor-icons/vue";
    import packagejson from "../package.json";

    const route = useRoute();


    // Refs
    const showNavbar      = ref(false);
    const darkModeEnabled = ref(false);
    const onlineVersion   = ref("");


    // Executed on page load
    onMounted(() => {

        // Enable dark mode if user had it enabled on the last visit (yeah, it is a string)
        if (localStorage.darkModeEnabled == "true") setDarkMode(true);

        // Check if update available note should be displayed in navbar
        checkForUpdate();

    });


    // Enables or disables dark mode
    function setDarkMode(enable: boolean) {
        console.log("setDarkMode: Set to " + enable);

        darkModeEnabled.value = enable;

        // Save to localstorage so that it will be saved when reloading the page
        localStorage.darkModeEnabled = enable;

        // Tell tailwind to get crackin
        if (enable) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }


    // Specify page information
    useSeoMeta({
        title: "Wardrobe",
        ogTitle: "Wardrobe",
        description: "Selfhosted clothing management web app",
        ogDescription: "Selfhosted clothing management web app"
    });

    useHead({
        link: [{ rel: "icon", type: "image/png", href: "favicon.png" }]
    });


    // Checks for an available update and displays a notification in the navbar
    async function checkForUpdate() {
        try {
            let output = await fetch("https://raw.githubusercontent.com/3urobeat/wardrobe/main/package.json");
            let parsed = await output.json();

            console.log("checkForUpdate: Version found online: " + parsed.version);

            onlineVersion.value = parsed.version;

        } catch (err) {

            console.log("checkForUpdate: Failed to check GitHub repository for an available update. " + err)
        }
    }
</script>
