/*
 * File: unitConversion.ts
 * Project: wardrobe
 * Created Date: 2026-03-04 10:39:01
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-07 20:42:47
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


/*
    Implements Vue frontend interaction with model/unit.ts with automatic conversion based on user settings
*/


import type { ServerSettings } from "~/model/storage";
import { UnitTypes, TemperatureOperation, type TemperatureUnit, UnitStrMap } from "~/model/unit";


const useSet = (): Ref<ServerSettings> => useState("storedServerSettings");


/**
 * Gets configured temp unit from settings
 * @returns Returns configured temp unit type
 */
export function getConfTempUnit(): UnitTypes {
    return useSet().value.temperatureUnit;
}

/**
 * Gets string of configured temp unit from settings
 * @returns Returns configured temp unit string
 */
export function getConfTempUnitStr(): string {
    return UnitStrMap[getConfTempUnit()];
}


/**
 * Auto converts TemperatureUnit between user setting (get) and base type (set)
 * @param prop Reference to property
 */
export function computedTemp(prop: TemperatureOperation) {
    console.debug("[DEBUG] computedTemp init");

    return computed({
        get(): TemperatureUnit {
            console.debug("[DEBUG] computedTemp get");
            return prop.getAs(useSet().value.temperatureUnit);
        },
        set(newValue: TemperatureUnit) {
            console.debug("[DEBUG] computedTemp set");
            prop.setFrom(newValue);
        }
    });
}
// This function is probably stupid and perhaps breaks reactivity but I don't know anymore, this commit has to go
// TODO: Yep, init gets called on every update
