/*
 * File: unit.ts
 * Project: wardrobe
 * Created Date: 2026-03-01 22:01:20
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-07 21:24:58
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


/*
    Implements units supported by wardrobe and their operations
*/


// Supported temperature units
export enum UnitTypes {
    KELVIN = 0,
    CELSIUS = 1,
    FAHRENHEIT = 2
}
// Subtype indicating which Unit can have which types would probably be neat

// Provides mappings of supported units to human readable format
export const UnitStrMap = {
    [UnitTypes.KELVIN]: "K",
    [UnitTypes.CELSIUS]: "°C",
    [UnitTypes.FAHRENHEIT]: "°F"
} as const;


// Generic type to communicate (a converted/non base unit) value with corresponding unit
export type Unit<T> = {
    unit: UnitTypes,
    value: T
}

export type TemperatureKelvin = number; // I added this type alias to make raw incoming data (e.g. in WeatherData) more descriptive
export type TemperatureUnit   = Unit<TemperatureKelvin>;

export const TemperatureUnitDefault: TemperatureUnit = {
    unit: UnitTypes.KELVIN,
    value: 0
} as const;


/**
 * Converts temperature unit data to human readable string
 * @param data Data to convert
 * @param round Optional: Should value be rounded
 * @returns Returns string in "value unit" format
 */
export function temperatureUnitToString(data: TemperatureUnit, round?: boolean): string {
    return `${round ? Math.round(data.value) : data.value} ${UnitStrMap[data.unit]}`;
}


// Unit operation base class
abstract class UnitOperation {
    protected          unitTypeRaw: UnitTypes; // Base type never changes
    protected abstract valueRaw:    unknown;   // Value is always of base type

    // Constructor sets immutable base type, subclass constructor sets value (since valueRaw is abstract here)
    constructor(unitData: Unit<unknown>) {
        this.unitTypeRaw = unitData.unit;
    }

    /**
     * Get current data
     * @returns Current data of base type
     */
    get(): Unit<unknown> {
        return {
            unit: this.unitTypeRaw,
            value: this.valueRaw
        };
    }

    /**
     * Set new data
     * @param unitData New raw type value to set
     */
    protected set(unitData: Unit<unknown>) { // Set operation on raw type should not be directly accessible
        if (unitData.unit != this.unitTypeRaw) {
            throw(`UnitData is not of base type ${UnitStrMap[this.unitTypeRaw]} (${this.unitTypeRaw})!`);
        }

        this.valueRaw = unitData.value;
    }

    // Unit conversions from and to base type, to be implemented by subclass
    abstract getAs(unit: UnitTypes): Unit<unknown>;
    abstract setFrom(unitData: Unit<unknown>): Unit<unknown>; // Return converted unitData
}


// Temperature Unit operation class
export class TemperatureOperation extends UnitOperation {
    protected override valueRaw: TemperatureKelvin;

    /**
     * Create Temperature Unit
     * @constructor
     * @param unitData Initial data of base type Kelvin
     */
    constructor(unitData: TemperatureUnit) {
        if (unitData.unit != TemperatureUnitDefault.unit) { // Would be cool to enforce this check in parent base class
            throw(`UnitData ${unitData.unit} is not of base type ${TemperatureUnitDefault.unit}!`);
        }

        super(unitData);
        this.valueRaw = unitData.value;
    }

    /**
     * Convert and get value
     * @param unit Unit to convert to
     * @returns Returns converted value
     */
    getAs(unit: UnitTypes): TemperatureUnit {
        switch (unit) {
            case UnitTypes.KELVIN:
                return { unit: UnitTypes.KELVIN, value: this.valueRaw }; // Raw value is already kelvin
            case UnitTypes.CELSIUS:
                return { unit: UnitTypes.CELSIUS, value: this.valueRaw - 273.15 };
            case UnitTypes.FAHRENHEIT:
                return { unit: UnitTypes.FAHRENHEIT, value: ((this.valueRaw - 273.15) * 1.8) + 32 };
            default:
                throw("Unsupported unit");
        }
    }

    /**
     * Convert and set new value
     * @param unitData Unit & Value to convert from
     */
    setFrom(unitData: TemperatureUnit): TemperatureUnit {
        switch (unitData.unit) {
            case UnitTypes.KELVIN:
                break;              // Nothing to do
            case UnitTypes.CELSIUS:
                unitData.value += 273.15;
                break;
            case UnitTypes.FAHRENHEIT:
                unitData.value = ((unitData.value - 32) / 1.8) + 273.15;
                break;
            default:
                throw("Unsupported unit");
        }

        unitData.unit = UnitTypes.KELVIN; // We converted value to base unit Kelvin above
        this.set(unitData);

        return unitData;
    }

}
