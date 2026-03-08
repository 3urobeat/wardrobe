/*
 * File: utils.ts
 * Project: wardrobe
 * Created Date: 2026-01-23 22:00:18
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-02 21:24:38
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { ServerSettings } from "~/model/storage";
import { TemperatureUnit, toCelsius, toFahrenheit } from "~/model/unit";
import type { WeatherData } from "~/model/weather";


/**
 * Helper function to query generate-uuid API route
 * @returns UUID
 */
export async function getUUIDFromServer(): Promise<string> {
    const res = await fetch("/api/generate-uuid");

    return (await res.text()); // TODO: Do I want to catch any exception here? If ID couldn't be generated, requesting element should not get created anyway
}


/**
 * Helper function to query get-image API route
 * @param imgPath File path to request
 * @param width Optional: Request scaled down image
 * @returns
 */
export async function getImageFromServer(imgPath: string, width: number|undefined) {
    if (!imgPath) return "";

    const res = await fetch("/api/get-image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            filePath: imgPath,
            width: width
        })
    });

    return await res.text();
}


/**
 * Attempts to geolocate client
 * @throws Throws exception on failure
 * @returns Returns array containing [ lat, lon ] on success
 */
export async function geolocateClient(): Promise<[ lat: number, lon: number ]> {

    // https://ip-api.com/docs/api:json
    const res = await fetch("http://ip-api.com/json?fields=lat,lon,offset,city,countryCode", {
        method: "GET"
    });

    const resBody = await res.json();

    if (res.status != 200) {
        throw((resBody.message || "Unknown Error"));
    }

    return [ resBody.lat, resBody.lon ];

}


/**
 * Helper function to query get-weather API route
 * @returns Object containing error message and weather data
 */
export async function getWeatherFromServer() {

    // Get settings
    const storedServerSettings: Ref<ServerSettings> = useState("storedServerSettings");

    const response: { error: string | null, weather: WeatherData | null } = {
        error: null,
        weather: null
    };


    // Get lat/lon from geolocation API or from settings
    let lat;
    let lon;

    if (storedServerSettings.value.location.useGeolocation) {
        [ lat, lon ] = await geolocateClient()
            .catch((err) => {
                response.error = "Geolocation failed: " + err + " - You may set a fixed latitude / longitude value in settings.";
                return [ undefined, undefined ];
            });
    } else {
        lat = storedServerSettings.value.location.lat;
        lon = storedServerSettings.value.location.lon;

        if (lat == undefined || lon == undefined) {
            response.error = "Geolocation is disabled but no latitude / longitude is set in settings!";
        }
    }


    // Use lat/lon to get weather
    if (lat != undefined && lon != undefined) {
        const res = await fetch("/api/get-weather", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lat: lat,
                lon: lon
            })
        });

        const resBody = await res?.json();

        if (res.ok) {
            response.weather = resBody as WeatherData;
        } else {
            response.error = resBody.message;
        }
    }


    // Return result
    return response;

}


/**
 * Helper function to convert temperature in kelvin to unit selected in settings
 * @param value Input value
 * @returns Output value
 */
export function convertTempKelvinToSetting(value: number) {
    const storedServerSettings: Ref<ServerSettings> = useState("storedServerSettings");

    switch (storedServerSettings.value.temperatureUnit) {
        case TemperatureUnit.CELSIUS:
            return toCelsius(TemperatureUnit.KELVIN, value);
        case TemperatureUnit.FAHRENHEIT:
            return toFahrenheit(TemperatureUnit.KELVIN, value);
        default:
            return value;
    }
}
