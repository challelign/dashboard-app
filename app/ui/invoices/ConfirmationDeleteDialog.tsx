'use client';
import { useRef, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { InvoicesTable } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import InvoiceStatus from './status';

interface ConfirmationDialogProps {
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  onDelete: () => void;
  invoice: InvoicesTable;
}
const ConfirmationDeleteDialog = ({
  showConfirmation,
  setShowConfirmation,
  onDelete,
  invoice,
}: ConfirmationDialogProps) => {
  const cancelButtonRef = useRef(null);

  const deleteInvoiceWithId = () => {
    // Perform the actual deletion logic here
    onDelete();
    setShowConfirmation(false);
  };

  return (
    <Transition.Root show={showConfirmation} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setShowConfirmation}
      >
        {/* Dialog overlay */}
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

        {/* Dialog content */}
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            {/* Dialog panel */}
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
                    {/* Dialog icon */}
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    {/* Dialog content */}
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete Invoice Of {invoice.customer.name}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to Delete this Invoice ? All of
                          your data will be permanently removed. This action
                          cannot be undone.
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
                          <p>
                            Invoice Status :
                            <InvoiceStatus status={invoice.status} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Dialog actions */}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
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
  );
};

export default ConfirmationDeleteDialog;
