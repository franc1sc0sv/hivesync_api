FROM node:latest
WORKDIR /home/app
COPY package*.json ./
RUN npm i 
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
