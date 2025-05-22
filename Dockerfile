# -------- Production Build Stage --------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build:copy

# -------- Production Serve Stage --------
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app .
CMD ["npm", "run","start:prod"]
EXPOSE 3000
