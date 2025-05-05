// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'nishanthkj12@gmail.com' },
    update: {},
    create: {
      name: 'Nishanth K J',
      email: 'nishanthkj12@gmail.com',
      password: "$2b$10$9K4M/Xu43VrNdCIXYQkzre4aQBkq5QKdZ1g/TI3qmV.Ylkf24PimS", // Hashed "AdminAdmin"
      role: 'FARMER',
    },
  });

  console.log(`🔍 Found user: ${user.name} (${user.email})`);
  console.log('🌱 Seeding stocks...');

  await prisma.stock.createMany({
    data: [
      { name: 'Body', quantity: 233, location: 'New Donald', cost: 19.5, sellingPrice: 29.5, userId: user.id },
      { name: 'Rock', quantity: 249, location: 'North Michellechester', cost: 25.3, sellingPrice: 35.3, userId: user.id },
      { name: 'Well', quantity: 300, location: 'Port Brittanymouth', cost: 10.75, sellingPrice: 20.5, userId: user.id },
      { name: 'Agent', quantity: 136, location: 'East Arthur', cost: 12.8, sellingPrice: 19.8, userId: user.id },
      { name: 'Per', quantity: 182, location: 'Johnsonside', cost: 15.2, sellingPrice: 24.5, userId: user.id },
      { name: 'Cut', quantity: 174, location: 'Pricefurt', cost: 13.7, sellingPrice: 22.0, userId: user.id },
      { name: 'Role', quantity: 296, location: 'Trevorside', cost: 11.9, sellingPrice: 21.4, userId: user.id },
      { name: 'Them', quantity: 82, location: 'North Randy', cost: 9.99, sellingPrice: 18.0, userId: user.id },
      { name: 'Method', quantity: 155, location: 'Knightside', cost: 14.1, sellingPrice: 25.0, userId: user.id },
      { name: 'Life', quantity: 92, location: 'East Johnmouth', cost: 16.8, sellingPrice: 28.0, userId: user.id },
    ],
  });
  

  console.log('🌱 Seeding workers...');

  await prisma.worker.createMany({
    data: [
      { name: 'Jessica Andrews', role: 'Supervisor', farm: 'South Garyville', cost: 1200, userId: user.id },
      { name: 'Chad Dyer', role: 'Irrigation', farm: 'Port Feliciamouth', cost: 950, userId: user.id },
      { name: 'Steven Brown', role: 'Harvester', farm: 'Douglasmouth', cost: 1100, userId: user.id },
      { name: 'Christine Moore', role: 'Irrigation', farm: 'Port Ericabury', cost: 1000, userId: user.id },
      { name: 'Kimberly Lopez', role: 'Irrigation', farm: 'West Jason', cost: 980, userId: user.id },
      { name: 'Nathan Moreno', role: 'Planter', farm: 'North Patriciaport', cost: 1050, userId: user.id },
      { name: 'Jason Jimenez', role: 'Supervisor', farm: 'New Victoriamouth', cost: 1300, userId: user.id },
      { name: 'Robert Rodriguez', role: 'Planter', farm: 'South Randy', cost: 1025, userId: user.id },
      { name: 'Ronald Miller', role: 'Supervisor', farm: 'Williamsport', cost: 1350, userId: user.id },
      { name: 'Toni Alvarez', role: 'Supervisor', farm: 'North Karen', cost: 1250, userId: user.id },
    ],
  });

  console.log('🌱 Seeding soil data...');

  // await prisma.soilData.createMany({
  //   data: [
  //     {
  //       userId: user.id,
  //       nitrogen: 3.67,
  //       phosphorous: 1.95,
  //       potassium: 4.68,
  //       ph: 6.21,
  //       rainfall: 60.8,
  //       state: 'Ohio',
  //       city: 'Richardburgh',
  //     },
  //     {
  //       userId: user.id,
  //       nitrogen: 1.01,
  //       phosphorous: 3.38,
  //       potassium: 4.49,
  //       ph: 6.67,
  //       rainfall: 212.08,
  //       state: 'Hawaii',
  //       city: 'Martinezmouth',
  //     },
  //   ],
  // });
  await prisma.soilData.createMany({
    data: [
      {
        userId: user.id,
        N: 1.1,
        P: 2.2,
        K: 3.3,
        pH: 6.5,
        EC: 0.5,
        OC: 0.7,
        S: 10,
        Zn: 0.8,
        Fe: 1.5,
        Cu: 0.9,
        Mn: 0.6,
        B: 0.4,
        fertilityClass: 'High',
        confidence: 0.94,
      },
    ],
  });
  
  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
