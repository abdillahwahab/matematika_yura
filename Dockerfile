FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/data && chmod 755 /app/data

EXPOSE 3000

CMD ["npm", "start"]
