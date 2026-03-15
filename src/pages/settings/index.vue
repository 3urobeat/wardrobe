<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:51:02
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-15 20:15:58
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>
    <TitleBarBasic>
        <button class="custom-button-primary" @click="saveChanges">
            <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
            {{ $t('save') }}
        </button>
    </TitleBarBasic>

    <div class="flex flex-col py-20 gap-8" @change="emitChangesMadeEvent()">

        <!-- User Settings section -->
        <div class="flex-col w-full h-60 p-2 rounded-2xl shadow-lg select-none bg-bg-input-light dark:bg-bg-input-dark transition-all">
            <div class="custom-label-primary w-fit h-fit py-0! px-2! m-2">
                {{ $t('settingsUserSettings') }}
            </div>
            <div class="grid grid-cols-2 gap-2 w-fit ml-2 p-2">
                <!-- TODO
                <label class="custom-label-secondary text-nowrap py-0! px-2! w-fit" for="saveSelectedFilters">Save Selected Filters?</label>
                <input id="saveSelectedFilters" type="checkbox" class="size-4 self-center" :checked="saveSelectedFilters"> -->
            </div>
        </div>

        <!-- Server Settings section -->
        <div class="flex-col w-full h-60 p-2 rounded-2xl shadow-lg select-none bg-bg-input-light dark:bg-bg-input-dark transition-all">
            <div class="custom-label-primary w-fit h-fit py-0! px-2! m-2">
                {{ $t('settingsServerSettings') }}
            </div>

            <!-- Setting cards -->
            <div class="flex h-44 mx-2">

                <!-- General -->
                <div class="shrink-0 px-2 m-2 rounded-xl shadow-md bg-bg-field-light dark:bg-bg-field-dark">
                    <div class="flex gap-x-2 mt-2 mb-3 ml-2 h-6">
                        <div class="custom-label-icon-only"> <!-- This extra div just for the icon to scale correctly is stupid -->
                            <PhGear class="text-text-light dark:text-text-dark"></PhGear>
                        </div>
                        <label class="custom-label-primary py-0! px-2!">{{ $t('general') }}</label>
                    </div>

                    <div class="grid grid-cols-2 gap-x-2 gap-y-0.5 ml-1">
                        <label class="custom-label-secondary text-nowrap py-0! px-2! w-fit" for="temperatureUnit">{{ $t('settingsTemperatureUnit') }}</label>
                        <select id="temperatureUnit" class="custom-input-secondary w-1/2 h-6! px-2!" v-model="localServerSettings.temperatureUnit"> <!-- TODO: Options are not centered? -->
                            <option :value="Unit.KELVIN">{{ UnitStrMap[Unit.KELVIN] }}</option>
                            <option :value="Unit.CELSIUS">{{ UnitStrMap[Unit.CELSIUS] }}</option>
                            <option :value="Unit.FAHRENHEIT">{{ UnitStrMap[Unit.FAHRENHEIT] }}</option>
                        </select>
                    </div>
                </div>

                <!-- Weather Settings -->
                <div class="shrink-0 px-2 m-2 rounded-xl shadow-md bg-bg-field-light dark:bg-bg-field-dark">
                    <div class="flex gap-x-2 mt-2 mb-3 ml-2 h-6">
                        <div class="custom-label-icon-only"> <!-- This extra div just for the icon to scale correctly is stupid -->
                            <PhCloud class="text-text-light dark:text-text-dark"></PhCloud>
                        </div>
                        <label class="custom-label-primary py-0! px-2!">{{ $t('weather') }}</label>
                    </div>

                    <div class="grid grid-cols-2 gap-x-2 gap-y-0.5 ml-1">
                        <label class="custom-label-secondary text-nowrap py-0! px-2! w-fit" for="useGeolocation">{{ $t('settingsLocationAutomatic') }}</label>
                        <input id="useGeolocation" type="checkbox" class="size-4 self-center" v-model="localServerSettings.location.useGeolocation">

                        <label class="custom-label-secondary text-nowrap py-0! px-2! w-fit" for="locationLat">{{ $t('settingsLocationForceLat') }}</label>
                        <input id="locationLat" type="number" class="custom-input-secondary w-1/2 h-6! px-2!" placeholder="52.520" v-model.trim="localServerSettings.location.lat" :disabled="localServerSettings.location.useGeolocation">

                        <label class="custom-label-secondary text-nowrap py-0! px-2! w-fit" for="locationLon">{{ $t('settingsLocationForceLon') }}</label>
                        <input id="locationLon" type="number" class="custom-input-secondary w-1/2 h-6! px-2!" placeholder="13.405" v-model.trim="localServerSettings.location.lon" :disabled="localServerSettings.location.useGeolocation">

                        <label class="custom-label-secondary text-nowrap py-0! px-2! w-fit" for="weatherApiKey">{{ $t('settingsWeatherApiKey') }}</label>
                        <input id="weatherApiKey" type="password" class="custom-input-secondary w-full h-6! px-2!" placeholder="W8orAGjB6NCnefMVX7bdpesKXJokemVV" v-model.trim="localServerSettings.weatherApiKey">
                    </div>
                </div>

            </div>
        </div>

        <!-- Server Jobs section -->
        <div class="flex-col w-full h-60 p-2 rounded-2xl shadow-lg select-none bg-bg-input-light dark:bg-bg-input-dark transition-all">
            <div class="custom-label-primary w-fit h-fit py-0! px-2! m-2">
                {{ $t('settingsServerJobs') }}
            </div>

            <!-- Job cards -->
            <div class="flex h-44 mx-2">
                <div
                    class="shrink-0 px-2 m-2 rounded-xl shadow-md bg-bg-field-light dark:bg-bg-field-dark"
                    v-for="thisJobInfo in jobs"
                    :key="thisJobInfo.name"
                >
                    <!-- Check if server is waiting to register core jobs -->
                    <div class="flex-col m-2" v-if="thisJobInfo.name == CoreJobPendingDummy">
                        <div class="custom-label-icon-only w-6 mb-3"> <!-- This extra div just for the icon to scale correctly is stupid -->
                            <PhHourglassMedium class="text-text-light dark:text-text-dark"></PhHourglassMedium>
                        </div>
                        <p class="custom-label-secondary py-0! px-2! break-normal whitespace-pre-line"> <!-- whitespace-pre-line preserves \n in text -->
                            {{ $t('settingsServerJobsRegistrationPendingText') }}
                        </p>
                    </div>
                    <div v-else>
                        <!-- Job name -->
                        <div class="flex gap-x-2 mt-2 mb-3 ml-2 h-6">
                            <div class="custom-label-icon-only"> <!-- This extra div just for the icon to scale correctly is stupid -->
                                <PhArrowClockwise class="text-text-light dark:text-text-dark"></PhArrowClockwise>
                            </div>
                            <label class="custom-label-primary py-0! px-2!">{{ thisJobInfo.name }}</label>
                        </div>

                        <!-- Job info -->
                        <div class="grid grid-cols-2 gap-x-2 gap-y-0.5 ml-1" v-for="[key, value] of Object.entries(thisJobInfo)">
                            <label v-if="key != 'name'" class="custom-label-secondary py-0! px-2! w-fit">{{ key }}:</label>

                            <label v-if=     "key == 'interval'">{{ formatTimeLocalized(value as number) }}</label>
                            <input v-else-if="key == 'runOnRegistration'" type="checkbox" class="size-4 self-center" :checked="value as boolean" disabled>
                            <label v-else-if="key == '_lastExecTimestamp' || key == '_registeredAt'">{{ formatTimestamp(value as number) }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Server Info section -->
        <div class="flex w-full h-60 p-2 rounded-2xl shadow-lg select-none bg-bg-input-light dark:bg-bg-input-dark transition-all">
            <div class="custom-label-primary w-fit h-fit py-0! px-2! m-2">
                {{ $t('settingsServerInfo') }}
            </div>
            <div>

            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import { PhArrowClockwise, PhCheck, PhCloud, PhGear, PhHourglassMedium } from "@phosphor-icons/vue";
    import TitleBarBasic from "~/components/titleBarBasic.vue";
    import type { ServerSettings } from "~/model/storage";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "~/composables/responseIndicator";
    import { CoreJobPendingDummy, type JobInfo } from "~/model/job";
    import { Unit, UnitStrMap } from "~/model/unit";
    import { formatTimeLocalized } from "~/composables/unitConversion";


    // Refs
    const storedServerSettings: Ref<ServerSettings> = useState("storedServerSettings");
    let   localServerSettings:  Ref<ServerSettings> = useCloned(storedServerSettings, { manual: true }).cloned; // I'm not using useCloned's sync() as it just wouldn't work :shrug:
    const jobs:                 Ref<JobInfo[]>      = ref([]);

    const saveSelectedFilters:  Ref<boolean>        = ref(false);


    // Load data
    const jobRes = await useFetch("/api/get-registered-jobs-info");
    jobs.value = jobRes.data.value!;

    // Client side only
    onBeforeMount(() => {
        saveSelectedFilters.value = getUXSettings().saveSelectedFilters;
    });


    // Saves user & server settings
    async function saveChanges() {

        // Save user settings to cookie
        setUXSetting("saveSelectedFilters", saveSelectedFilters.value);

        // Send server settings to backend to be saved in database
        const res = await fetch("/api/set-settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(localServerSettings.value)
        });

        const resBody = await res.json();

        // Indicate success/failure
        if (resBody.success) {
            responseIndicatorSuccess();
            emitChangesMadeEvent(false);

            // Manually sync local clones to global cache, useCloned's sync() didn't work. Refresh clone of localServerSettings to avoid it gaining reactivity
            storedServerSettings.value = localServerSettings.value;
            localServerSettings        = useCloned(storedServerSettings, { manual: true }).cloned;

            emitSettingsSavedEvent(); // Notify listeners to e.g. refresh weather in globalTitleBar
        } else {
            responseIndicatorFailure();
        }

    }

</script>
