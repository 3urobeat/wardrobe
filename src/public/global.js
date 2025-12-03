/*
 * File: global.js
 * Project: wardrobe
 * Created Date: 2025-12-03 18:23:42
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-03 19:07:26
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


// This file is loaded in header of app.vue


// Sets dark mode on page load. Defined in header to fix transition load - https://stackoverflow.com/a/14416030
if (localStorage.getItem("darkModeEnabled") === "true") {
    document.documentElement.classList.add("dark");
}
