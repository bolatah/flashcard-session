# Use the official Node.js 14 image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install the project dependencies
RUN yarn install --production

# Copy the rest of the app's source code to the working directory
COPY . .

# Copy the .env.local file to the working directory
COPY .env.local .env

# Build the Next.js app
RUN yarn build

# Expose the desired port (replace 3000 with your app's actual port)
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]