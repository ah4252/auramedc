const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updates = [
    {
      old: 'تمنراست — جامعة أحمد دراية أدرار — ملحقة',
      new: 'تمنراست — جامعة الجزائر 1 — ملحقة'
    },
    {
      old: 'تيبازة — جامعة البليدة 1 — ملحقة',
      new: 'تيبازة — جامعة الجزائر 1 — ملحقة'
    },
    {
      old: 'سوق أهراس — جامعة باجي مختار عنابة — ملحقة',
      new: 'سوق أهراس — جامعة قسنطينة 3 — ملحقة'
    },
    {
      old: 'معسكر — جامعة الجيلالي ليابس سيدي بلعباس — ملحقة',
      new: 'معسكر — جامعة مستغانم — ملحقة'
    }
  ];

  for (const update of updates) {
    const result = await prisma.user.updateMany({
      where: { wilaya: update.old },
      data: { wilaya: update.new }
    });
    console.log(`Updated ${result.count} users from '${update.old}' to '${update.new}'`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
