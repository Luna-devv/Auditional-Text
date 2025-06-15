FROM oven/bun:slim

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --frozen-lockfile
RUN bun install -g tsc

COPY . .

RUN bun run build;

CMD ["bun", "start"]