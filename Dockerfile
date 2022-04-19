FROM node:12-alpine as builder
MAINTAINER Feer93
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install\
        && npm install typescript -g
RUN npm install -g ts-node
COPY . .
RUN npm run build
#Falla si no hay base de datos desplegada.
#RUN npm run migrations:generate 
#RUN npm run migrations:run
#Esto no es necesario pero nos vale para probar
EXPOSE 3400
CMD ["sh", "./run_all.sh"]
