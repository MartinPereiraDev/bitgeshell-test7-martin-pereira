# Frontend Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
ENV NODE_ENV=development
EXPOSE 3001
CMD ["npm", "start"] 