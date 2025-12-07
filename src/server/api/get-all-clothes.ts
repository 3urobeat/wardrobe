/*
 * File: get-all-clothes.ts
 * Project: wardrobe
 * Created Date: 2025-09-08 16:16:50
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-07 22:13:42
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { getClothing } from "~/composables/useClothesDb";


/**
 * This API route gets all stored clothes and returns them
 * Params: {}
 * Returns: { }
 */


/* [
    {
        id: "0",
        title: "Dress 1",
        description: "abcdef",
        imgPath: "/favicon.png",
        addedTimestamp: Date.now() - (Math.random() * 10000),
        labelIDs: ["0"]
    },
    {
        id: "1",
        title: "Dress 2",
        description: "abcdef",
        imgPath: "/favicon.png",
        addedTimestamp: Date.now() - (Math.random() * 10000),
        labelIDs: ["0", "2", "7"]
    },
    {
        id: "2",
        title: "Shirt 1",
        description: "abcdef",
        imgPath: "/favicon.png",
        addedTimestamp: Date.now() - (Math.random() * 10000),
        labelIDs: ["0", "4"]
    },
    {
        id: "3",
        title: "Pants 1",
        description: "abcdef",
        imgPath: "/favicon.png",
        addedTimestamp: Date.now() - (Math.random() * 10000),
        labelIDs: ["2", "8"]
    }
] */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    console.log("API get-all-clothes: Received request");

    // Ask db helper to retrieve item
    const clothes = await getClothing(null);

    return clothes;

});
