FROM buildkite/puppeteer:latest

RUN npm install -g nodemon \
    && apt-get update \
    && apt install -y chromium-browser

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