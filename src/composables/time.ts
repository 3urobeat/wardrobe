/*
 * File: time.ts
 * Project: wardrobe
 * Created Date: 2025-09-08 15:48:21
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-19 17:46:30
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


/**
 * Formats time to x hours ago if <24 hours, otherwise formats to ISO8601
 * @param timestamp The timestamp to convert
 * @param alwaysShowTimestamp Controls whether to always show the ISO8601 timestamp, even if <24h ago
 * @returns Formatted time, either in "x hours ago" or ISO8601 format
 */
export function formatTime(timestamp: number, alwaysShowTimestamp?: boolean) {
    let until = Math.abs((Date.now() - timestamp) / 1000);
    let untilUnit = "seconds";

    if (until < 86400 && !alwaysShowTimestamp) { // 24h in sec
        if (until > 60) {
            until = until / 60; untilUnit = "minutes";

            if (until > 60) {
                until = until / 60; untilUnit = "hours";
            }
        }

        return `${Math.round(until)} ${untilUnit} ago`;
    } else {
        const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

        return ((new Date(timestamp - timezoneOffset)).toISOString().replace(/T/, " ").replace(/\..+/, ""));
    }
}
