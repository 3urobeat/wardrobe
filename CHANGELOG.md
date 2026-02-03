# Wardrobe Changelog

**Current**  
- [0.1.0](#0.1.0)
  
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

&nbsp;
