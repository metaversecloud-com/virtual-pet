FROM --platform=linux/arm64 node:18-alpine3.17
WORKDIR /app
COPY . ./
EXPOSE 3000
ENV BROWSER=none
ENV NODE_ENV=production
ENV PORT=5000
CMD ["npm", "start"]
