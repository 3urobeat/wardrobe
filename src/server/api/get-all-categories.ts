/*
 * File: get-all-categories.ts
 * Project: wardrobe
 * Created Date: 2025-09-09 22:04:46
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-09 22:08:06
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { Category } from "~/model/label";


/**
 * This API route gets all stored categories and returns them
 * Params: {}
 * Returns: { }
 */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    console.log("API get-all-labels: Received request");

    const categories: Category[] = [
        {
            id: "0",
            name: "season"
        },
        {
            id: "1",
            name: "type"
        },
        {
            id: "2",
            name: "year"
        },
        {
            id: "3",
            name: "occasion"
        },
        {
            id: "4",
            name: "color"
        }
    ];

    return categories;

});
