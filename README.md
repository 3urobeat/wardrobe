<div align="center">
    <p align="center"><img width=65% src="src/public/logo-dark.png"></p>
    <h4>👚 Selfhosted clothing management web app for your personal wardrobe or commercial store!</h4>
    <div>
        <a href="#introduction">Introduction</a> •
        <a href="#installation">Installation</a> •
        <a href="#getting-started">Getting Started</a> •
        <a href="#other">Other</a>
    </div>
    <!-- <img src="./.github/img/demo.png"> -->
</div>

&nbsp;

<a id="introduction"></a>

# ✨ Introduction
Wardrobe is a selfhosted, *non-vibe-coded* clothing & outfit management web application.  

Do you also have a lot of clothes, still struggle to decide what to wear and even sometimes forget about some?  
Then this is for you! *...and me, cause this was the motivation behind building it*

Wardrobe features:
- **Add your Clothes**
  - with: Image, Title, Description, Labels
- **Create Outfits:** Combine your Clothes!
  - with: Clothes per body part, Title, Labels
  - Automatically generated preview image based on clothes added
- **Browse your Clothes & Outfits**
  - What do I want to wear today?
  - Search by text, sort by name/date or filter by a combination of labels
  - Upcoming: Get recommendations based on your local weather & outfit labels
- **Create Labels & Label Categories**
  - Keep it organized: Each label has a category
  - Keep it *re*organized: Reorder your labels by dragging to sort them by relevancy
  - Comes pre-configured with labels for type, season, year, color & body part to get you started

...and more to come!

<!-- <p align="center"><img src=".github/img/preview.png"></p>  -->

&nbsp;

<a id="installation"></a>

# 🛠️ Installation
System Requirements: Next to none.

## Docker (recommended):
Run the container using:  
`docker run -p <host_port>:3000 -v <path_on_host>:/usr/src/wardrobe/data 3urobeat/wardrobe:latest`

Replace `<host_port>` with the port you want to access wardrobe at.

Replace `<path_on_host>` with a path to where wardrobe should store persistent data at on your system.  
This can either be a docker volume, which you can create using [docker volume create](https://docs.docker.com/reference/cli/docker/volume/create/) (recommended), or a directory bind (to e.g. your home folder `~/wardrobe-data`).

> [!NOTE]
> If you are using Portainer, make sure to set the working directory at the bottom to `/usr/src/wardrobe`

<br>

<details>
  <summary><strong>Method 2: Local Install</strong> (Click to unfold)</summary>

  Make sure you have git, node & npm installed on your system.

  Clone the git repository:  
  `git clone https://github.com/3urobeat/wardrobe`  
  `cd wardrobe`

  Install dependencies:  
  `npm ci --omit=dev`

  Build the project:  
  `npm run build`

  Start the service:  
  `PORT=<host_port> npm run start`

  Replace `<host_port>` with the port you want to access wardrobe at.  
  If you omit `PORT=`, port 3000 will be used.

</details>

&nbsp;

> [!IMPORTANT]  
> No matter which method you chose, make sure to protect the service!  
> Wardrobe does not provide any authentication itself and I do not guarantee any security.  
> Either use a 3rdParty auth service, enable password protection in your reverse proxy, put it behind a VPN or don't expose it to the outside at all.

&nbsp;

<a id="getting-started"></a>

# 🚀 Getting Started
After starting the service, access wardrobe in your browser using the IP of your host and the port you specified above.  
Assuming you started the project on your current device using the default port 3000, open: `http://localhost:3000`

TBA

&nbsp;

<a id="other"></a>

# 📝 Other
## Icons
SVG Icons, including the favicon, were taken from [Phosphor Icons](https://phosphoricons.com/).  
All icons are licensed under [MIT](https://raw.githubusercontent.com/phosphor-icons/homepage/master/LICENSE).
