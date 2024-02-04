FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g tsc

COPY . .

RUN npm run build || exit 0;

CMD ["npm", "start"]