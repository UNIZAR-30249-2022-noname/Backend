FROM node:12-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm install\
        && npm install typescript -g
RUN npm install -g ts-node
COPY . .
CMD ["npm" ,"run", "build"]
#Esto no es necesario pero nos vale para probar
EXPOSE 2700 
#CMD ["npm", "run", "server"]