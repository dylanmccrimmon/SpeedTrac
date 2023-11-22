FROM debian:10-slim AS get-speedtest

RUN apt-get update && apt-get install curl gnupg1 apt-transport-https dirmngr lsb-release -y
RUN curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash
RUN apt-get install speedtest

FROM alpine as install-dependencies
RUN apk add --no-cache npm
WORKDIR /build
COPY . .
RUN npm install

FROM alpine as prod-stage
RUN apk add --no-cache nodejs
LABEL maintainer="Dylan McCrimmon <dylan@mccrimmon.uk>"

WORKDIR /usr/src/app

CMD [ "node", "app.js" ]

COPY --from=get-speedtest /usr/bin/speedtest /usr/bin/speedtest
COPY --from=install-dependencies /build .
