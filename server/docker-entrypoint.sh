#!/bin/sh
set -e

npx prisma migrate deploy
exec pm2-runtime start ecosystem.config.cjs
