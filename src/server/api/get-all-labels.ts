/*
 * File: get-all-labels.ts
 * Project: wardrobe
 * Created Date: 2025-09-09 16:43:11
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-21 16:23:48
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { Label } from "~/model/label";


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
            category: {
                id: "0",
                name: "season"
            }
        },
        {
            id: "1",
            name: "Cocktail Dress",
            category: {
                id: "1",
                name: "type"
            }
        },
        {
            id: "2",
            name: "2025",
            category: {
                id: "2",
                name: "year"
            }
        },
        {
            id: "3",
            name: "Special",
            category: {
                id: "3",
                name: "occasion"
            }
        },
        {
            id: "4",
            name: "Red",
            category: {
                id: "4",
                name: "color"
            }
        },
        {
            id: "5",
            name: "Spring",
            category: {
                id: "0",
                name: "season"
            }
        },
        {
            id: "6",
            name: "Fall",
            category: {
                id: "0",
                name: "season"
            }
        },
        {
            id: "7",
            name: "Torso",
            category: {
                id: "5",
                name: "body part"
            }
        },
        {
            id: "8",
            name: "Legs",
            category: {
                id: "5",
                name: "body part"
            }
        },
        {
            id: "9",
            name: "Feet",
            category: {
                id: "5",
                name: "body part"
            }
        },
        {
            id: "0",
            name: "Winter",
            category: {
                id: "0",
                name: "season"
            }
        },
        {
            id: "4",
            name: "Blue",
            category: {
                id: "4",
                name: "color"
            }
        }

    ];

    return labels;

});
