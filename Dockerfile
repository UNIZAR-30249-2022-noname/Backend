FROM node:12-alpine as builder
MAINTAINER Feer93
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install\
        && npm install typescript -g
RUN npm install -g ts-node
COPY . .
#Esto no es necesario pero nos vale para probar
EXPOSE 2750
CMD ["npm", "run", "start"]