/*
 * File: get-all-labels.ts
 * Project: wardrobe
 * Created Date: 2025-09-09 16:43:11
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-08 21:45:54
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { getAllLabels } from "~/composables/useLabelsDb";


/**
 * This API route gets all stored labels and returns them
 * Params: {}
 * Returns: Label[]
 */

/* {
    id: "0",
    name: "Summer",
    categoryID: "0"
},
{
    id: "1",
    name: "Cocktail Dress",
    categoryID: "1"
},
{
    id: "2",
    name: "2025",
    categoryID: "2"
},
{
    id: "3",
    name: "Special",
    categoryID: "3"
},
{
    id: "4",
    name: "Red",
    categoryID: "4"
},
{
    id: "5",
    name: "Spring",
    categoryID: "0"
},
{
    id: "6",
    name: "Fall",
    categoryID: "0"
},
{
    id: "7",
    name: "Torso",
    categoryID: "5"
},
{
    id: "8",
    name: "Legs",
    categoryID: "5"
},
{
    id: "9",
    name: "Feet",
    categoryID: "5"
},
{
    id: "0",
    name: "Winter",
    categoryID: "0"
},
{
    id: "4",
    name: "Blue",
    categoryID: "4"
} */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    console.log("API get-all-labels: Received request");

    // Ask db helper to retrieve items
    const labels = await getAllLabels();

    return labels;

});
