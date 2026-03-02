/*
 * File: unit.ts
 * Project: wardrobe
 * Created Date: 2026-03-01 22:01:20
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-02 21:29:07
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


// Supported temperature units
export enum TemperatureUnit {
    KELVIN = 0,
    CELSIUS = 1,
    FAHRENHEIT = 2
}

/**
 * Convert temperature to Kelvin
 * @param unit Input unit
 * @param value Input value
 * @returns Value converted to Kelvin
 */
export function toKelvin(unit: TemperatureUnit, value: number): number {
    switch (unit) {
        case TemperatureUnit.KELVIN:
            return value;
        case TemperatureUnit.CELSIUS:
            return value + 273.15;
        case TemperatureUnit.FAHRENHEIT:
            return ((value - 32) / 1.8) + 273.15;
        default:
            throw("Unsupported unit");
    }
}

/**
 * Convert temperature to Celsius
 * @param unit Input unit
 * @param value Input value
 * @returns Value converted to Celsius
 */
export function toCelsius(unit: TemperatureUnit, value: number): number {
    switch (unit) {
        case TemperatureUnit.KELVIN:
            return value - 273.15;
        case TemperatureUnit.CELSIUS:
            return value;
        case TemperatureUnit.FAHRENHEIT:
            return (value - 32) / 1.8;
        default:
            throw("Unsupported unit");
    }
}

/**
 * Convert temperature to Fahrenheit
 * @param unit Input unit
 * @param value Input value
 * @returns Value converted to Fahrenheit
 */
export function toFahrenheit(unit: TemperatureUnit, value: number): number {
    switch (unit) {
        case TemperatureUnit.KELVIN:
            return ((value - 273.15) * 1.8) + 32;
        case TemperatureUnit.CELSIUS:
            return (value * 1.8) + 32;
        case TemperatureUnit.FAHRENHEIT:
            return value;
        default:
            throw("Unsupported unit");
    }
}


// Provides mappings of units to human readable format
export const UnitMap = {
    [TemperatureUnit.KELVIN]: "K",
    [TemperatureUnit.CELSIUS]: "°C",
    [TemperatureUnit.FAHRENHEIT]: "°F"
} as const;
