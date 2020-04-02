FROM node:13.12

WORKDIR /app

COPY ./.npmrc ./.npmrc
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

COPY ./client/package.json ./client/package.json
COPY ./client/package-lock.json ./client/package-lock.json

RUN npm install

COPY ./client ./client
COPY ./common ./common

RUN npm run build

COPY ./server ./server

CMD npm run start
