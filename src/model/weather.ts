/*
 * File: weather.ts
 * Project: wardrobe
 * Created Date: 2026-02-12 17:57:36
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-08 14:04:15
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { TemperatureOperation, UnitTypes, type TemperatureKelvin } from "./unit";


// https://openweathermap.org/weather-conditions
export enum WeatherConditionGroupID {
    "Thunderstorm" = 2,
    "Drizzle" =      3,
    "Rain" =         5,
    "Snow" =         6,
    "Fog" =          7,
    "Clear" =        8,
    "Clouds" =       81
}


/**
 * Converts openweathermap weather ID to WeatherConditionGroupID
 * @param val Value to convert
 */
export function weatherIdToCondition(val: number): WeatherConditionGroupID {
    if (!val || val < WeatherConditionGroupID.Thunderstorm * 100 || val > WeatherConditionGroupID.Clouds * 100) {
        throw("Invalid val");
    }

    if (val > 800 && val < 900) { // Special case
        return WeatherConditionGroupID.Clouds;
    }

    return Math.trunc(val / 100);
}
// TODO: This sucks and can probably be realised directly in TS types but I don't know how right now


// Static data type for backend which only operates on base types (regarding Temperature)
// https://openweathermap.org/current?collection=current_forecast
export interface WeatherData {
    coord: {
        lon: number
        lat: number
    },
    weather: {
        id: number,
        main: string,
        description: string,
        icon: string
    }[],
    base: string,
    main: {
        temp: TemperatureKelvin,
        feels_like: TemperatureKelvin,
        temp_min: TemperatureKelvin,
        temp_max: TemperatureKelvin,
        pressure: number,
        humidity: number,
        sea_level: number,
        grnd_level: number
    },
    visibility: number,
    wind: {
        speed: number,
        deg: number,
        gust: number
    },
    rain?: {
        "1h"?: number
    },
    snow?: {
        "1h"?: number
    },
    clouds: {
        all: number
    },
    dt: number,
    sys: {
        type: number,
        id: number,
        country: string,
        sunrise: number,
        sunset: number
    },
    timezone: number,
    id: number,
    name: string,
    cod: number
}


// Reactive data type for frontend
export interface WeatherDataReactive extends Omit<WeatherData, "main"> {
    main: {
        temp: TemperatureOperation,
        feels_like: TemperatureOperation,
        temp_min: TemperatureOperation,
        temp_max: TemperatureOperation,
        pressure: number,
        humidity: number,
        sea_level: number,
        grnd_level: number
    }
}
// TODO: label-category-speciality does this in one type with an OR instead of an additional type


/**
 * Converts WeatherData to WeatherDataReactive
 * @param weather WeatherData to convert
 * @returns Converted WeatherDataReactive
 */
export function reactifyWeatherData(weather: WeatherData): WeatherDataReactive {
    const weatherConv = weather as unknown as WeatherDataReactive;

    /* eslint-disable camelcase */
    weatherConv.main.temp       = new TemperatureOperation({ unit: UnitTypes.KELVIN, value: weather.main.temp });
    weatherConv.main.feels_like = new TemperatureOperation({ unit: UnitTypes.KELVIN, value: weather.main.feels_like });
    weatherConv.main.temp_min   = new TemperatureOperation({ unit: UnitTypes.KELVIN, value: weather.main.temp_min });
    weatherConv.main.temp_max   = new TemperatureOperation({ unit: UnitTypes.KELVIN, value: weather.main.temp_max });
    /* eslint-enable camelcase */

    return weatherConv;
}
