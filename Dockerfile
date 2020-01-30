FROM node:12-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN ["mkdir","-p","cypress/plugins"]
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.17-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
