FROM node:19.4.0

ARG USER=appuser
ARG UID=999

RUN apt-get update && apt-get install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# RUN apt-get install chromium-browser


RUN npm install -g nodemon

RUN mkdir -p /usr/src/app
RUN mkdir -p /home/$USER

RUN groupadd -g $UID $USER && \
    useradd -r -u $UID -g $USER $USER
RUN chown -R $USER:$USER /usr/src/app
RUN chown -R $USER:$USER /home/$USER

WORKDIR /usr/src/app
COPY ./src/package.json ./

RUN npm install
RUN npm install puppeteer --unsafe-perm=true --allow-root
RUN node ./node_modules/puppeteer/install.js

# COPY ./src/ ./
USER $USER
EXPOSE 8080
CMD [ "nodemon", "server.js" ]