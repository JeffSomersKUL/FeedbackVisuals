FROM node:12.10-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --unsafe-perm --only=production
COPY ./dist ./dist
ENV NODE_ENV production
EXPOSE 4000
CMD npm run start:raw