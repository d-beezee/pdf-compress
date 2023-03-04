FROM node:18-alpine3.16 AS node
FROM alpine:3.15 as base

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN apk add yarn ghostscript  ghostscript-dev g++ cmake make 

COPY . .
RUN yarn 


CMD yarn start