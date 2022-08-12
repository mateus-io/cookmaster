FROM node:17-alpine3.14

ADD . /usr/src/cookmaster-frontend

WORKDIR /usr/src/cookmaster-frontend

RUN echo "Installing dependencies" && npm install

RUN echo "Build" && npm run build

EXPOSE 4173

CMD npm run preview