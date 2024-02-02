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
import { customers, invoices } from './placeholder-data';
import { count } from 'console';
import { data } from 'autoprefixer';

const ITEMS_PER_PAGE = 6;

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

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
) {
  try {
    /*    const total_invoices = await prisma.invoice.count({
      where: {
        OR: [
          { customer: { name: { contains: query } } },
          { customer: { email: { contains: query } } },
        ],
      },
    });
    console.log(total_invoices);
     */
    /* 
    const totalPendingInvoices = await prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'pending',
      },
    });

    const total_pending = formatCurrency(totalPendingInvoices._sum.amount ?? 0);
    console.log(totalPendingInvoices._sum.amount);
    console.log(total_pending);

    const totalPaidInvoices = await prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'paid',
      },
    });
    const total_paid = formatCurrency(totalPaidInvoices._sum.amount ?? 0);
    console.log(total_paid); 
    */
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const dataCustomer = await prisma.customer.findMany({
      include: {
        // invoices: true,
        invoices: {
          orderBy: {
            date: 'desc',
          },
        },
      },
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            email: {
              contains: query,
            },
          },
        ],
      },

      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    const customers = dataCustomer.map((customer) => {
      console.log(customer);
      const totalPaid = customer.invoices
        .filter((invoice) => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.amount, 0);
      const total_paid = formatCurrency(totalPaid ?? 0);

      const totalPending = customer.invoices
        .filter((invoice) => invoice.status === 'pending')
        .reduce((sum, invoice) => sum + invoice.amount, 0);
      const total_pending = formatCurrency(totalPending ?? 0);
      const total_invoices = customer.invoices.length;
      // console.log(total_invoices);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices,
        total_paid,
        total_pending,
      };
    });
    console.log(customers);
    return customers;
  } catch (err) {
    console.log(data);
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  console.log(query);
  try {
    const count = await prisma.customer.count({
      where: {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      },
    });
    console.log('count=>', count);
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
