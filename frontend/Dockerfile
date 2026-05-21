FROM node:15.13-alpine

# Set the working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json if present
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install react-scripts 

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build


# Copy the generated index.html file to the appropriate location




