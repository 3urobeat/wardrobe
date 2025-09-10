/*
 * File: get-all-items.ts
 * Project: wardrobe
 * Created Date: 2025-09-08 16:16:50
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-10 16:42:44
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { Item } from "~/model/item";


/**
 * This API route gets all stored items and returns them
 * Params: {}
 * Returns: { }
 */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    console.log("API get-all-items: Received request");

    const items: Item[] = [
        {
            id: "0",
            title: "Dress 1",
            imgPath: "favicon.png",
            addedTimestamp: Date.now() - (Math.random() * 10000),
            labels: [
                {
                    id: "0",
                    name: "Summer",
                    category: {
                        id: "0",
                        name: "season"
                    }
                }
            ]
        },
        {
            id: "1",
            title: "Dress 2",
            imgPath: "favicon.png",
            addedTimestamp: Date.now() - (Math.random() * 10000),
            labels: [
                {
                    id: "0",
                    name: "Spring",
                    category: {
                        id: "0",
                        name: "season"
                    }
                },
                {
                    id: "2",
                    name: "2025",
                    category: {
                        id: "2",
                        name: "year"
                    }
                }
            ]
        },
        {
            id: "2",
            title: "Shirt 1",
            imgPath: "favicon.png",
            addedTimestamp: Date.now() - (Math.random() * 10000),
            labels: [
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
            ]
        },
        {
            id: "3",
            title: "Pants 1",
            imgPath: "favicon.png",
            addedTimestamp: Date.now() - (Math.random() * 10000),
            labels: [
                {
                    id: "2",
                    name: "2025",
                    category: {
                        id: "2",
                        name: "year"
                    }
                }
            ]
        }
    ];

    return items;

});
