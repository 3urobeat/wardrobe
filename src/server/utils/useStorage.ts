/*
 * File: useStorage.ts
 * Project: wardrobe
 * Created Date: 2026-03-22 12:21:07
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-22 12:39:45
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import path from "path";
import { readdir, stat } from "fs/promises";


// Thanks: https://stackoverflow.com/a/69418940
async function getDirSize(dir: string): Promise<number> {
    const files = await readdir(dir);
    const stats = files.map((file) => stat(path.join(dir, file)));

    return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0);
}
// TODO: Not recursive


/**
 * Returns size of database storage in Bytes
 */
export async function getDBStorageSize(): Promise<number> {
    return await getDirSize("data/database");
}


/**
 * Returns size of image storage in Bytes
 */
export async function getImageStorageSize(): Promise<number> {
    return (await getDirSize("data/images/outfit")) + (await getDirSize("data/images/clothing"));
}
