# Wardrobe Changelog

**Current**  
- [0.1.0](#0.1.0)
- [0.2.0](#0.2.0)
  
&nbsp;

<a id="0.1.0"></a>

## 2026-02-03, Version 0.1.0
**Welcome to the initial pre-release version of Wardrobe!**  
It includes all the fundamental features of Wardrobe:
- Create/Browse/Delete Clothes
  - with: Image, Title, Description, Labels
- Create/Browse/Delete Outfits
  - with: Clothes per Body Part, Title, Labels
  - a rotatable preview human is displayed on View/Edit page
  - auto-updating image collection of clothes displayed on Browse page
- Create/Browse/Delete/Reorder Labels & Categories
  - Special Categories:
    - Season: Date Range, Temperature Range (no further functionality yet)
    - Color: Color Picker (no further functionality yet)
    - Body Part: Head, Hands, Arms, Torso, Legs, Feet (used in outfit editor)
  - Docker Image ships with set of default labels & categories
- Search by text, sort by name/date or filter by a combination of labels
- Jobs
  - default database/storage cleanup job already registered
  - viewable on Settings page
- Light/Dark Mode
- Responsive UI: Desktop, Tablet & Mobile layouts
- Docs: Overview, Installation instructions, Getting started paragraph

The UI has been developed & tested in Firefox.  
Docker image, build upon node:lts-alpine: https://hub.docker.com/repository/docker/3urobeat/wardrobe

Commit: [02bb46b](https://github.com/wardrobe-hq/wardrobe/commit/02bb46b)

&nbsp;

<a id="0.2.0"></a>

## 2026-03-22, Version 0.2.0
**Additions:**
- Added centralized localStorage read/write helper
- Added a scaling slider to clothes & outfits view pages
- Added browser dark mode detection if user has no local UX settings preference set
- Added mobile support to threedModelViewer
- Added weather:
  - Added weather API interaction with openweathermap.org
  - Added weather display in global title bar
  - Added weather configuration to settings page
  - Added automatic geolocating based on IP, overridable with lat/lon
- Added settings database, corresponding API routes and fields on settings page
- Added color for disabled inputs
- Added units:
  - Added temperature unit setting
  - Added auto unit conversion framework for frontend based on user setting
- Added outfit recommendation popup based on season speciality labels (temperature & date range)
- Added settingsSaved event to settings page
- Added i18n language translation system [#1](https://github.com/wardrobe-hq/wardrobe/issues/1)
  - Added English language
  - Added German language
  - Added debug language (only visible in debug mode)
  - Added language selector to settings page
- Added text hover auto scroll for overflowing lang strings in navbar buttons
- Added DayMonthInput component for season speciality popup
- Added yearless date comparison framework for season speciality & outfit recommendation popups
- Added setting process name & terminal title on server startup with new "core" plugin
- Added global server storage handler which (for now) provides size functions
- Added server statistics and show them on settings page

&nbsp;

**Reworks:**
- Improved scaling of titleBarFull
- Reset search bar on page switch and only show it on supported pages
- Centralized unsaved changes on page switch handler
- Log messages will now use appropiate log levels
- Reworked styling of search & dark mode toggle button group
- Improved label season speciality popup styling
- Added top/bottom overflow handling to pickerDialog positioning
- Made sure unset season speciality values remain null
- Reworked data handling on all pages to fix discarding unsaved changes not resetting local state
- Adjusted logos
- Made sure UXSettings is fully populated in getUXSettings()
- Improved navbar styling to make it more language consistent
- Improved formatTimestamp() function

&nbsp;

**Fixes:**
- Fixed overflow & scroll in filter bar
- Fixed navbar having y transition
- Fixed useFetch already mounted warning on settings page save
- Fixed empty outfits showing ALL clothes in preview image
- Fixed navbar hamburger button not being pressable
- Fixed card overflow on settings page

&nbsp;

**Changes:**
- Picker dialog will now close on ESC keypress
- Updated dependencies
- Minor other changes

The GitHub repository has moved from [my personal account](https://github.com/3urobeat) to a [GitHub Org](https://github.com/wardrobe-hq)!

Commit: [](https://github.com/wardrobe-hq/wardrobe/commit/)

&nbsp;
