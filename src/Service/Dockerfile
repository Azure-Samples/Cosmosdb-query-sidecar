FROM node:18-alpine as Builder
COPY . .
RUN npm run dev
RUN npm run build

FROM node:18-alpine
COPY --from=Builder dist ./
COPY --from=Builder package.json ./
RUN npm run prod
EXPOSE 8080
CMD [ "node", "index.js" ]