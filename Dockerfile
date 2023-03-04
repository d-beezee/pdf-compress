FROM node:18-alpine3.16 AS node
FROM alpine:3.16 as base

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN apk add yarn
COPY package.json ./
COPY yarn.lock ./
RUN yarn --ignore-scripts

COPY . .

RUN yarn build


FROM alpine:3.16 as web

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

COPY --from=base /dist /app/build
COPY package*.json /app/
WORKDIR /app
RUN apk add yarn
RUN yarn --prod --ignore-scripts
COPY .env .env
CMD node build/index.js