import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

async function createUser(email, password, name, role = 'STUDENT') {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      email,
      password,
      name,
      role
    });
    console.log(`Created ${role}: ${name} - ${email}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to create ${role}: ${email}`, error.message, error.response?.data);
    return null;
  }
}

async function main() {
  console.log('Starting to create 100 users and 100 teachers...');

  // Create 100 students
  for (let i = 1; i <= 100; i++) {
    const email = `student${i}@example.com`;
    const name = `Student ${i}`;
    await createUser(email, 'password123', name, 'STUDENT');
  }

  // Create 100 teachers
  for (let i = 1; i <= 100; i++) {
    const email = `teacher${i}@example.com`;
    const name = `Teacher ${i}`;
    await createUser(email, 'password123', name, 'TEACHER');
  }

  console.log('Finished creating users.');
}

main().catch(console.error);