/*
 * File: storage.ts
 * Project: wardrobe
 * Created Date: 2026-02-04 16:25:20
 * Author: 3urobeat
 *
 * Last Modified: 2026-02-14 19:34:23
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { defaultUXSettings, UXSettingsName, type UXSettings } from "~/model/storage";


/**
 * Reads (and parses) property from user's localStorage
 * @param name Name of localStorage property to read
 * @param isObject If function should attempt to parse property as JSON object
 * @returns Returns read or parsed value on success or `null` on failure
 */
function parseLocalStorage(name: string, isObject?: boolean): string | object | null {
    try {
        // Attempt to read from browser storage
        const res = localStorage.getItem(UXSettingsName);

        // Attempt to parse result if it is supposed to be an object
        if (res && isObject) {
            return JSON.parse(res);
        }

        return res;

    } catch (err) {

        console.error(`Failed to read ${isObject ? "& parse " : ""}localStorage element '${name}'!`, err);
        return null;
    }
}


/**
 * (Stringifies and) saves property in user's localStorage
 * @param name Name of localStorage property to set
 * @param value Value to set
 * @param isObject If function should attempt to stringify JSON object value
 */
function setLocalStorage(name: string, value: string | object, isObject?: boolean) {
    try {
        if (isObject) {
            value = JSON.stringify(value);
        }

        localStorage.setItem(UXSettingsName, value as string);
    } catch (err) {
        console.error(`Failed to ${isObject ? "parse & " : ""}save localStorage element '${name}'!`, err);
    }
}


/**
 * Attempts to parse UX settings from user's localStorage. Returns default UX settings on failure
 * @returns Returns UXSettings
 */
export function getUXSettings(): UXSettings {
    const res = parseLocalStorage(UXSettingsName, true);

    if (!res) {
        console.log("Using default UX settings...");
        return defaultUXSettings;
    }

    return res as UXSettings;
}
// TODO: Duplicated in public/global.js


/**
 * Updates a value of the user's UX settings and saves it to localStorage
 * @param key Key to update
 * @param value Value to set
 */
export function setUXSetting(key: keyof UXSettings, value: any) {

    // Get current object
    const element = getUXSettings();

    console.log(element, key, value)

    element[key] = value;

    setLocalStorage(UXSettingsName, element, true);

}
