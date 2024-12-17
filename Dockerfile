# Use official Node.js image from Docker Hub
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code
COPY . .

# Expose port for the API
EXPOSE 3000

# Command to run the app
CMD ["node", "index.js"]