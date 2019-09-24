FROM node:12-alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:latest
EXPOSE 3000
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
