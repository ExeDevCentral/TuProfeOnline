const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edustream.com' },
    update: {},
    create: {
      email: 'admin@edustream.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  // Create teacher users
  const teacher1Password = await bcrypt.hash('teacher123', 10);
  const teacher1 = await prisma.user.upsert({
    where: { email: 'prof.garcia@edustream.com' },
    update: {},
    create: {
      email: 'prof.garcia@edustream.com',
      password: teacher1Password,
      name: 'Prof. Ricardo García',
      role: 'TEACHER',
    },
  });

  const teacher2Password = await bcrypt.hash('teacher123', 10);
  const teacher2 = await prisma.user.upsert({
    where: { email: 'dra.smith@edustream.com' },
    update: {},
    create: {
      email: 'dra.smith@edustream.com',
      password: teacher2Password,
      name: 'Dra. Sarah Smith',
      role: 'TEACHER',
    },
  });

  // Create student users
  const student1Password = await bcrypt.hash('student123', 10);
  const student1 = await prisma.user.upsert({
    where: { email: 'estudiante1@edustream.com' },
    update: {},
    create: {
      email: 'estudiante1@edustream.com',
      password: student1Password,
      name: 'Juan Pérez',
      role: 'STUDENT',
    },
  });

  const student2Password = await bcrypt.hash('student123', 10);
  const student2 = await prisma.user.upsert({
    where: { email: 'estudiante2@edustream.com' },
    update: {},
    create: {
      email: 'estudiante2@edustream.com',
      password: student2Password,
      name: 'María González',
      role: 'STUDENT',
    },
  });

  // Delete existing classes
  await prisma.class.deleteMany({});

  // Create classes
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const class1 = await prisma.class.create({
    data: {
      title: 'Matemáticas Avanzadas',
      description: 'Curso de álgebra y cálculo avanzado',
      teacherId: teacher1.id,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
      meetUrl: 'https://meet.google.com/abc-defg-hij',
      room: 'Aula 404',
      status: 'SCHEDULED',
    },
  });

  const class2 = await prisma.class.create({
    data: {
      title: 'Física Cuántica',
      description: 'Introducción a la mecánica cuántica',
      teacherId: teacher2.id,
      startTime: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000),
      endTime: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000),
      meetUrl: 'https://meet.google.com/xyz-uvwx-rst',
      room: 'Aula 201',
      status: 'SCHEDULED',
    },
  });

  // Delete existing enrollments
  await prisma.classEnrollment.deleteMany({});

  // Enroll students
  await prisma.classEnrollment.create({
    data: {
      classId: class1.id,
      studentId: student1.id,
    },
  });

  await prisma.classEnrollment.create({
    data: {
      classId: class1.id,
      studentId: student2.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Credenciales de prueba:');
  console.log('Admin: admin@edustream.com / admin123');
  console.log('Profesor: prof.garcia@edustream.com / teacher123');
  console.log('Estudiante: estudiante1@edustream.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
