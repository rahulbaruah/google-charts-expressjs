FROM node:19.4.0

RUN npm install -g nodemon \
    && apt-get update \
    && apt-get install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
    && apt-get install -y chromium

RUN npm inatall

RUN mkdir -p /usr/src/app
RUN mkdir -p /home/appuser

RUN groupadd -g 999 appuser && \
    useradd -r -u 999 -g appuser appuser
RUN chown -R appuser:appuser /usr/src/app
RUN chown -R appuser:appuser /home/appuser

USER appuser

WORKDIR /usr/src/app
COPY ./src/package.json ./

RUN npm install

# COPY ./src/ ./

EXPOSE 8080
CMD [ "nodemon", "server.js" ]