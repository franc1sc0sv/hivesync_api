FROM node
RUN mkidr -p /home/app
COPY . /home/app
RUN npm install
EXPOSE ${SOCIAL_SERVICE_PORT}
CMD [ "npm", "run", "start" ]
