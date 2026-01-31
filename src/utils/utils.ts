/*
 * File: utils.ts
 * Project: wardrobe
 * Created Date: 2026-01-23 22:00:18
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-31 11:52:47
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


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
