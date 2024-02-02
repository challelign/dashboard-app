const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // Create the "users" table if it doesn't exist
    /*   await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS user (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`; */

    // console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return prisma.user.upsert({
          where: { id: user.id },
          update: {},
          create: {
            id: user.id,
            name: user.name,
            email: user.email,
            password: hashedPassword,
          },
        });
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedInvoices() {
  try {
    // Create the "invoices" table if it doesn't exist
    /*     await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Invoice (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      customer_id VARCHAR(36) NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    )`; */

    // console.log(`Created "Invoice" table`);

    // Insert data into the "Invoice" table
    const insertedInvoices = await prisma.invoice.createMany({
      // data: invoices,
      data: invoices.map((invoice) => ({
        id: invoice.id,
        customer_id: invoice.customer_id,
        amount: invoice.amount,
        status: invoice.status,
        date: invoice.date,
      })),
      // Set `skipDuplicates` to true to skip inserting duplicates
      skipDuplicates: true,
    });
    console.log('insertedInvoices =>', insertedInvoices.count);

    console.log(`Seeded ${insertedInvoices.count} invoices`);

    return {
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
async function seedCustomers() {
  try {
    // Create the "customers" table if it doesn't exist
    /*   await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Customer (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
      image_url VARCHAR(255) NOT NULL
    )`; */

    // console.log(`Created "Customer" table`);

    // Insert data into the "Customer" table
    const insertedCustomers = await Promise.all(
      customers.map(async (customer) => {
        return prisma.customer.upsert({
          where: { id: customer.id },
          update: {},
          create: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            image_url: customer.image_url,
          },
        });
      }),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
async function seedRevenue() {
  try {
    // Create the "revenue" table if it doesn't exist
    /*   await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Revenue (
      month VARCHAR(4) NOT NULL PRIMARY KEY,
      revenue INT NOT NULL
    )`;
 */
    // console.log(`Created "Revenue" table`);

    // Insert data into the "Revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(async (rev) => {
        return prisma.revenue.upsert({
          where: { month: rev.month },
          update: {},
          create: {
            month: rev.month,
            revenue: rev.revenue,
          },
        });
      }),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
async function main() {
  try {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();

    await seedRevenue();
  } catch (err) {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  }
}

main();
