'use client';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, PowerIcon, Settt } from '@heroicons/react/20/solid';
import Image from 'next/image';
// import SettingIcon from '/public/SettingIcon.svg';
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProfileLogin({
  user,
  onClickLogout,
}: {
  user: string;
  onClickLogout: string;
}) {
  return (
    <Menu as="div" className=" relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset  ">
          {user} Profile
          <Image
            src="/customers/guillermo-rauch.png"
            className="rounded-full"
            alt={`${user}'s profile picture`}
            width={28}
            height={28}
          />
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-red-700"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  )}
                >
                  <div className="flex gap-3 ">
                    <FingerPrintIcon className="w-6  font-semibold text-gray-900" />{' '}
                    Account settings
                  </div>
                </a>
              )}
            </Menu.Item>

            <form method="POST" action={onClickLogout}>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block w-full px-4 py-2 text-left text-sm',
                    )}
                  >
                    <div className="flex gap-3">
                      <PowerIcon className="w-6" /> Sign out
                    </div>
                  </button>
                )}
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
