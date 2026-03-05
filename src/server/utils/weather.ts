/*
 * File: weather.ts
 * Project: wardrobe
 * Created Date: 2026-02-12 17:29:48
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-04 22:10:09
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { UnitTypes } from "~/model/unit";
import type { WeatherData } from "~/model/weather";


let weatherCache: WeatherData[] = [];


/**
 * Gets current weather data from API
 * @throws Throws rejection if function was unable to get current weather
 * @param lat
 * @param lon
 * @returns Current weather data from API
 */
async function getCurrentWeatherFromApi(lat: number, lon: number): Promise<WeatherData> {
    if (lat == undefined || lon == undefined) {
        throw("Parameters lat and lon are required");
    }

    const token = (await getServerSettings()).weatherApiKey;

    if (!token) {
        throw("No API key set! Please configure one in settings."); // TODO: Control flow via exception is meh
    }

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${token}`, {
        method: "GET"
    });

    const resBody = await res.json();

    if (res.status != 200 || resBody.cod != 200) {
        throw("Couldn't get weather data from API: " + (resBody.message || "Unknown Error"));
    }

    // Create known types
    /* eslint-disable camelcase */
    /* resBody.main.temp       = new TemperatureUnit(resBody.main.temp);
    resBody.main.feels_like = new TemperatureUnit(resBody.main.feels_like);
    resBody.main.temp_min   = new TemperatureUnit(resBody.main.temp_min);
    resBody.main.temp_max   = new TemperatureUnit(resBody.main.temp_max); */
    resBody.main.temp       = { unit: UnitTypes.KELVIN, value: resBody.main.temp };
    resBody.main.feels_like = { unit: UnitTypes.KELVIN, value: resBody.main.feels_like };
    resBody.main.temp_min   = { unit: UnitTypes.KELVIN, value: resBody.main.temp_min };
    resBody.main.temp_max   = { unit: UnitTypes.KELVIN, value: resBody.main.temp_max };
    /* eslint-enable camelcase */

    return resBody;

}


/**
 * Gets current weather for a location, either from cache or from API
 * @throws Throws exception if function was unable to get any weather
 * @param lat
 * @param lon
 * @returns Returns weather data that is less than 2 hours old and in the range of ~11 km from provided position
 */
export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
    if (lat == undefined || lon == undefined) {
        throw("Parameters lat and lon are required");
    }

    // Attempt to find recent entry (1 hour) in cache with precision of one decimal place; should be around 10km: https://en.wikipedia.org/wiki/Decimal_degrees#Precision
    const rounded = (num: number) => Math.round(num * 10) / 10;
    const recent  = 60 * 60 * 1;

    // Iterate over entire cache to find relevant element and clean it at the same time
    let cachedRes;

    weatherCache = weatherCache.filter((e) => {
        if (e.dt > (Date.now() / 1000) - recent) {
            if (rounded(e.coord.lat) == rounded(lat) && rounded(e.coord.lon) == rounded(lon)) {
                cachedRes = e;
                console.debug(`[DEBUG] Found cached weather for '${lat}, ${lon}'...`);
            }
            return true;
        }
        return false;
    });

    // Ask API if no cached element was found
    if (!cachedRes) {
        console.debug(`[DEBUG] Requesting current weather for '${lat}, ${lon}' from API...`);

        const apiRes = await getCurrentWeatherFromApi(lat, lon); // Let exception fall through

        // Add result to cache
        weatherCache.push(apiRes);

        console.debug("[DEBUG] Success, added response to cache.");

        return apiRes;
    }

    return cachedRes;
}
