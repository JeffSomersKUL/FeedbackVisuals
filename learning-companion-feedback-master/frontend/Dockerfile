FROM node:10.16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .
# --unsafe-perm --only=production
#COPY ./dist ./dist
#ENV NODE_ENV production
EXPOSE 3000
CMD npm run start