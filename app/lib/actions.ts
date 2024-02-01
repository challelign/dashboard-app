'use server';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { z } from 'zod';
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

// create Invoice

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  //   const date = new Date().toISOString().split('T')[0];
  const date = new Date().toISOString();

  //   console.log(customerId);
  const newInvoice = await prisma.invoice.create({
    data: {
      customer_id: customerId,
      amount: amountInCents,
      status: status,
      date: date,
    },
  });
  console.log(newInvoice);
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// update Invoice
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  console.log(id);
  const amountInCents = amount * 100;

  const updateInvoice = await prisma.invoice.updateMany({
    data: {
      customer_id: customerId,
      amount: amountInCents,
      status: status,
    },
    where: {
      id: id,
    },
  });

  console.log(updateInvoice);
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
// delete invoice
export async function deleteInvoice(id: string) {
  const deleteInvoice = await prisma.invoice.delete({
    where: {
      id: id,
    },
  });
  console.log(deleteInvoice);
  revalidatePath('/dashboard/invoices');
}
