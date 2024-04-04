FROM node

WORKDIR /usr/src/app
COPY package*.json .

RUN npm i 
COPY . .

EXPOSE ${GATEWAY_SERVICE_PORT}
CMD npm run dev