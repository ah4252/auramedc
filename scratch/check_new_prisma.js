const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();
console.log(Object.keys(prisma).filter(k => !k.startsWith('_')));
process.exit(0);
