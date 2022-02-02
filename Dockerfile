FROM node:16-buster

# Set working dir
WORKDIR /usr/src/app

# Install deps
COPY ./source/package.json ./package.json
RUN npm install

# Copy code
COPY ./ ./

