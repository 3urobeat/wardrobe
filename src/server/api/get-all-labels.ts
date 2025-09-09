/*
 * File: get-all-labels.ts
 * Project: wardrobe
 * Created Date: 2025-09-09 16:43:11
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-09 17:11:34
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { Label } from "~/model/item";


/**
 * This API route gets all stored labels and returns them
 * Params: {}
 * Returns: { }
 */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    console.log("API get-all-labels: Received request");

    const labels: Label[] = [
        {
            id: "0",
            name: "Summer",
            type: "season"
        },
        {
            id: "1",
            name: "Cocktail Dress",
            type: "type"
        },
        {
            id: "2",
            name: "2025",
            type: "year"
        },
        {
            id: "3",
            name: "Special",
            type: "occasion"
        },
        {
            id: "4",
            name: "Red",
            type: "color"
        },
        {
            id: "5",
            name: "Spring",
            type: "season"
        },
        {
            id: "6",
            name: "Fall",
            type: "season"
        }

    ];

    return labels;

});
