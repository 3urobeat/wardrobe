/*
 * File: settings.ts
 * Project: wardrobe
 * Created Date: 2025-09-08 15:21:35
 * Author: 3urobeat
 *
 * Last Modified: 2026-02-28 14:10:39
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


/*
 * UX Settings - Stored in localStorage, see utils/storage.ts
 */

export const UXSettingsName = "uxSettings";

// UX settings stored in user's browser
export type UXSettings = {

    // Boolean if user changed dark mode, null if automatic
    darkModeEnabled: boolean | null, // WARN: Used in public/global.js as well

    // Selected scaling for item cards in titleBarFull
    selectedItemCardsScaling: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,

    // Whether user enabled if selected filters should be persisted
    saveSelectedFilters: boolean // TODO

}

export const defaultUXSettings: UXSettings = {
    darkModeEnabled: null,
    selectedItemCardsScaling: 6,
    saveSelectedFilters: false
};



/**
 * Server Settings - Stored in database
 */

export type ServerSettings = {

    // Location settings, used for weather integration
    location: {
        // Get user's location from IP address. If true, lat & lon will be ignored
        useGeolocation: boolean,

        // Latitude & Longitude values to use if useGeolocation is false
        lat: number | null,
        lon: number | null
    },
    weatherApiKey: string

}

export const defaultServerSettings: ServerSettings = {
    location: {
        useGeolocation: true,
        lat: null,
        lon: null
    },
    weatherApiKey: ""
};
