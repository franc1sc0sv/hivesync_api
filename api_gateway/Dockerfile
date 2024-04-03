FROM node
RUN mkidr -p /home/app
COPY . /home/app
RUN npm install
EXPOSE ${AUTH_SERVICE_PORT}
CMD [ "npm", "run", "start" ]
