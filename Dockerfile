FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . . 

RUN npx prisma generate

EXPOSE 5002

CMD [ "npm", "run", "dev" ]