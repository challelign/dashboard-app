const { PrismaClient } = require('@prisma/client');
import { unstable_noStore as noStore } from 'next/cache';

// const prisma = new PrismaClient();
const prisma = new PrismaClient({
  log: ['info', 'query', 'warn', 'error'],
});

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  // Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { invoices } from './placeholder-data';
import { count } from 'console';
import { data } from 'autoprefixer';
import { equal } from 'assert';

export async function fetchRevenue() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prisma.revenue.findMany();

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  } finally {
    await prisma.$disconnect(); // Close the Prisma Client connection
  }
}

export async function fetchLatestInvoices() {
  try {
    noStore();
    // const latestInvoices2 = await prisma.Invoice.findMany({});
    // console.log('latestInvoices2', latestInvoices2);

    const latestInvoices = await prisma.invoice.findMany({
      select: {
        amount: true,
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
        id: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    });

    // YOU CAN UNCOMMENT AND USE THIS CODE IT IS THE SAME
    /*     const latestInvoices = await prisma.invoice.findMany({
      include: {
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    }); */

    console.log('latestInvoices', latestInvoices);

    const formattedInvoices = latestInvoices.map((invoice: any) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    console.log('formattedInvoices', formattedInvoices);

    return formattedInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  } finally {
    await prisma.$disconnect(); // Close the Prisma Client connection
  }
}

export async function fetchCardData() {
  // You can probably combine these into a single SQL query
  // However, we are intentionally splitting them to demonstrate
  // how to initialize multiple queries in parallel with JS.
  try {
    noStore();
    // Query to fetch the number of invoices
    const numberOfInvoices = await prisma.invoice.count();
    // Query to fetch the number of customers
    const numberOfCustomers = await prisma.customer.count();
    // Query to fetch the total paid and pending invoices
    const pendingCountPending = await prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'pending',
      },
    });
    // console.log(pendingCountPending);

    const invoiceStatusPaid = await prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'paid',
      },
    });
    // console.log(invoiceStatusPaid);

    const totalPaidInvoices = formatCurrency(
      invoiceStatusPaid._sum.amount ?? 0,
    );
    const totalPendingInvoices = formatCurrency(
      pendingCountPending._sum.amount ?? 0,
    );
    // console.log('totalPaidInvoices', totalPaidInvoices);
    // console.log('totalPendingInvoices', totalPendingInvoices);
    // console.log('numberOfCustomers', numberOfCustomers);
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.log(error);
    console.error('Prisma Error:', error);
    throw new Error('Failed to fetch card data.');
  } finally {
    await prisma.$disconnect(); // Close the Prisma Client connection
  }
}
const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        status: true,
        customer_id: true,
        customer: {
          select: {
            id: true,
            name: true,
            image_url: true,
            email: true,
          },
        },
      },

      where: {
        OR: [
          { status: { contains: query } },
          // { amount: { equals: Number(query) } },
          // { date: { equals: new Date(query) } },
          { customer_id: { contains: query } },
          { customer_id: { contains: query } },
          { customer: { name: { contains: query } } },
          { customer: { email: { contains: query } } },
        ],
      },
      orderBy: {
        date: 'desc',
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    // console.log(JSON.stringify(invoices, null, 2));
    console.log(invoices);
    return invoices;
  } catch (error) {
    console.log(error);
    console.log(invoices);
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}
export async function fetchInvoicesPages(query: string) {
  // console.log(query);
  try {
    const count = await prisma.invoice.count({
      where: {
        OR: [
          { status: { contains: query } },
          { customer_id: { contains: query } },
          { customer: { name: { contains: query } } },
          { customer: { email: { contains: query } } },
        ],
      },
    });
    // console.log('count=>', count);
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    console.log('totalPages =>', totalPages);

    return totalPages;
  } catch (error) {
    console.log(count);
    console.log(error);
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}
export async function fetchCustomers() {
  try {
    const data = await prisma.customer.findMany({
      select: {
        name: true,
        id: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // console.log(data);
    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchInvoiceById(id: string) {
  console.log(id);
  noStore();
  const invoiceId = Number(id);
  try {
    const data = await prisma.invoice.findUnique({
      select: {
        id: true,
        amount: true,
        date: true,
        status: true,
        customer_id: true,
      },
      where: {
        id: invoiceId,
      },
    });
    if (!data) {
      console.log(data);
      throw new Error('Invoice not found.');
    }
    // Convert amount from cents to dollars
    const invoice = {
      ...data,
      amount: data.amount / 100,
    };

    // const invoice = data?.map((invoice: InvoiceForm) => ({
    //   ...invoice,
    //   amount: data.amount / 100,
    // }));
    console.log(invoice);
    return invoice;
  } catch (error) {
    console.log(data);
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

// export async function fetchInvoicesPages(query: string) {
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       invoices.amount::text ILIKE ${`%${query}%`} OR
//       invoices.date::text ILIKE ${`%${query}%`} OR
//       invoices.status ILIKE ${`%${query}%`}
//   `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   }
// }
/* 


export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
} */
