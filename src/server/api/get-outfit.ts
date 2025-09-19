/*
 * File: get-outfit.ts
 * Project: wardrobe
 * Created Date: 2025-09-10 18:51:02
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-19 17:57:16
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { Outfit } from "~/model/outfit";


/**
 * This API route gets details for a stored clothing and returns them
 * Params: { id: string }
 * Returns: Outfit || null
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read body of the request we received
    const params = await readBody(event);

    if (!params || params.id === null) return {};

    console.log(`API get-outfit: Received request for id '${params.id}'...`);

    const outfit: Outfit = {
        id: "1",
        title: "Outfit 2",
        clothes: [{
            order: 0,
            clothing: {
                id: "1",
                title: "Dress 2",
                imgPath: "/favicon.png",
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
                    },
                    {
                        id: "7",
                        name: "Torso",
                        category: {
                            id: "5",
                            name: "body part"
                        }
                    }
                ]
            }
        }],
        addedTimestamp: Date.now() - (Math.random() * 10000),
        labels: [
            {
                id: "6",
                name: "Fall",
                category: {
                    id: "0",
                    name: "season"
                }
            }
        ]
    };

    return outfit;

});
