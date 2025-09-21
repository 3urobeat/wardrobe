/*
 * File: get-clothing.ts
 * Project: wardrobe
 * Created Date: 2025-09-08 16:16:54
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-21 14:59:49
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


/**
 * This API route gets details for a stored clothing and returns them
 * Params: {}
 * Returns: { }
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read body of the request we received
    const params = await readBody(event);

    if (!params || params.id === null) return {};

    console.log(`API get-clothing: Received request for id '${params.id}'...`);

    const clothing = {
        id: "2",
        title: "Shirt 1",
        description: "abcdef",
        imgPath: "/favicon.png",
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
    };

    return clothing;

});
