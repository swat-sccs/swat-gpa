FROM node:lts-bullseye
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN chown -R node /usr/src/app
RUN npm install -g serve
USER node
RUN npm install --production --silent
RUN npm run build
