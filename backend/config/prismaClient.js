// Central Prisma client instance for the backend
// Ensures a single connection pool is reused across the API

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;


