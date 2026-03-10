/*
 * File: unitConversion.ts
 * Project: wardrobe
 * Created Date: 2026-03-04 10:39:01
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-10 17:02:16
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
import { temperatureUnitToString, tempKelvinTo, UnitStrMap, Unit, type TemperatureKelvin } from "~/model/unit";


const useSet = (): Ref<ServerSettings> => useState("storedServerSettings");


/**
 * Gets configured temp unit from settings
 * @returns Returns configured temp unit type
 */
export function getConfTempUnit(): Unit {
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
 * Converts temperature to human readable string with unit from settings
 * @param value Value to display
 * @param rounded Optional: Should value be rounded
 * @returns Returns string in "value unit" format
 */
export function confTempToStr(value: TemperatureKelvin, rounded?: boolean): string {
    const unit = getConfTempUnit();
    return temperatureUnitToString(tempKelvinTo(value, unit)!, unit, rounded);
}
