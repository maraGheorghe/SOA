FROM node:lts-alpine

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY adoption-confirmation-service ./
COPY utils ./utils

ENTRYPOINT node main.js