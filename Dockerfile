# Step 1: Build the React app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
# Step 2: Serve the built app with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Copy default nginx configuration (optional)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]