# syntax=docker/dockerfile:1.7-labs

# File: Dockerfile
# Project: wardrobe
# Created Date: 2026-02-01 22:07:42
# Author: 3urobeat
#
# Last Modified: 2026-02-02 17:25:43
# Modified By: 3urobeat
#
# Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
#
# This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
# This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
# You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.


# Install dependencies in a separate container to speed up actual image creation
FROM node:lts-alpine AS temp

RUN mkdir -p /usr/wardrobe-temp
WORKDIR /usr/wardrobe-temp

# Install dependencies for canvas library
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev

# Install production dependencies
ENV NODE_ENV production
COPY package.json package-lock.json ./
RUN npm ci
#&& npm cache clean --force



# Build the actual image
FROM node:lts-alpine

# Create destination directory
RUN mkdir -p /usr/src/wardrobe
WORKDIR /usr/src/wardrobe

# Install runtime dependencies for canvas library
RUN apk add --update --no-cache \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev

# Set ownership and switch to unprivileged user
RUN chown -R node:node ./
USER node

# Copy dependencies over from temp container
COPY --from=temp --chown=node:node /usr/wardrobe-temp/ .
RUN ls -al ./

# Copy and build the app itself afterwards, note .dockerignore
COPY --chown=node:node . ./
RUN npm run build
RUN ls -al ./

# Expose port 3000 which nuxt uses
EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Start the application
CMD [ "npm", "run", "start" ]
