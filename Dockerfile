
# Use official Node.js LTS image
FROM node:20-alpine

# Accept JWT_SECRET as a build argument
ARG JWT_SECRET
ARG DATABASE_URL
ARG PORT
ENV JWT_SECRET=$JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV PORT=$PORT

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
