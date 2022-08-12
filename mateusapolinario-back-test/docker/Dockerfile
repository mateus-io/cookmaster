FROM node:14-alpine

ADD . /usr/src/cookmaster-backend

WORKDIR /usr/src/cookmaster-backend

RUN echo "Installing dependencies" && npm install

EXPOSE 3000

CMD npm start