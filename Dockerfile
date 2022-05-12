FROM node:16-alpine
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apk add chromium

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9090
CMD npm start