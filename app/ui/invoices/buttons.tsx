'use client';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { InvoicesTable } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import ConfirmationDeleteDialog from './ConfirmationDeleteDialog';
export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  console.log(id);
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
// dialog component ont used
/* export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <>
      <form action={deleteInvoiceWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
} */

// dialog component  used but not reusable
/* export function DeleteInvoice({
  id,
  invoice,
}: {
  id: string;
  invoice: InvoicesTable;
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const cancelButtonRef = useRef(null);

  const deleteInvoiceWithId = () => {
    // Perform the actual deletion logic here
    deleteInvoice(id);
    setShowConfirmation(false);
  };

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };
  return (
    <>
      <div className="flex justify-end gap-2">
        <button
          className="rounded-md border p-2 hover:bg-gray-100"
          onClick={handleDeleteClick}
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </div>
      {showConfirmation && (
        <Transition.Root show={showConfirmation} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setShowConfirmation}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Delete Invoice Of {invoice.customer.name}
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to Delete this Invoice ? All
                              of your data will be permanently removed. This
                              action cannot be undone.
                            </p>
                            <div className="mt-2" />
                            <Dialog.Title
                              as="h3"
                              className="text-base font-semibold leading-6 text-gray-900"
                            >
                              This All Information will be Deleted
                            </Dialog.Title>
                            <div className="mt-2" />
                            <div className="rounded bg-gray-100 p-4">
                              <p>Email :{invoice.customer.email}</p>
                              <p>Amount :{formatCurrency(invoice.amount)}</p>
                              <p>Invoice Status :{invoice.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        // onClick={() => setOpen(false)}
                        onClick={deleteInvoiceWithId}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setShowConfirmation(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  );
}
 */

// reusable dialog component
export function DeleteInvoice({
  id,
  invoice,
}: {
  id: string;
  invoice: InvoicesTable;
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClickModal = () => {
    setShowConfirmation(true);
  };

  const deleteInvoiceWithId = () => {
    // Perform the actual deletion logic here
    // import { deleteInvoice } from '@/app/lib/actions';
    deleteInvoice(id);
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <button
          className="rounded-md border p-2 hover:bg-gray-100"
          onClick={handleClickModal}
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </div>
      {showConfirmation && (
        <ConfirmationDeleteDialog
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          onDelete={deleteInvoiceWithId}
          invoice={invoice}
        />
      )}
    </>
  );
}
