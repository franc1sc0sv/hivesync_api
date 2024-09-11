FROM node

WORKDIR /usr/src/app
COPY package*.json .

RUN npm i 
COPY . .

EXPOSE ${PEER_PORT}
CMD npm run dev