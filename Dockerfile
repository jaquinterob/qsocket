FROM node:18
WORKDIR /app
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
