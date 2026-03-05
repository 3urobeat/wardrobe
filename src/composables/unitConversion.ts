/*
 * File: unitConversion.ts
 * Project: wardrobe
 * Created Date: 2026-03-04 10:39:01
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-05 22:57:06
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { ServerSettings } from "~/model/storage";
import { UnitTypes, TemperatureOperation, type TemperatureUnit, UnitStrMap } from "~/model/unit";


/*
    Implements Vue frontend interaction with model/unit.ts with automatic conversion based on user settings
*/


/**
 * Gets configured temp unit from settings
 * @returns Returns configured temp unit type
 */
export function getConfTempUnit(): UnitTypes {
    const storedServerSettings: Ref<ServerSettings> = useState("storedServerSettings");

    return storedServerSettings.value.temperatureUnit;
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
export function computedTemp(prop: TemperatureUnit) { // ...or should this be a Ref<>?
    console.debug("[DEBUG] computedTemp init");
    const storedServerSettings: Ref<ServerSettings> = useState("storedServerSettings");
    const unitOperation = new TemperatureOperation(prop); // Throws exception if prop is not of base type

    return computed({
        get(): TemperatureUnit {
            console.debug("[DEBUG] computedTemp get");
            return unitOperation.getAs(storedServerSettings.value.temperatureUnit);
        },
        set(newValue: TemperatureUnit) {
            console.debug("[DEBUG] computedTemp set");
            prop = unitOperation.setFrom(newValue);
        }
    });
}
// This function is probably stupid and perhaps breaks reactivity but I don't know anymore, this commit has to go
// TODO: Yep, init gets called on every update
