FROM tarampampam/node:latest
WORKDIR /usr/src/rpg_bot_build
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
RUN apt update
RUN apt install espeak ffmpeg -y
COPY . .
CMD ["pm2-docker", "start", "process.json"]
