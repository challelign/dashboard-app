'use client';
import Link from 'next/link';

import { useDebouncedCallback } from 'use-debounce';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from './button';
import { useState } from 'react';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  console.log(searchParams);
  const pathname = usePathname();
  // console.log(pathname);'/dashboard/invoices'
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(term);

    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // const clearQuery = () => {
  //   const params = new URLSearchParams(searchParams);
  //   replace(`${pathname}`);
  //   params.delete('query');
  // };
  return (
    <div className="relative flex flex-1 flex-shrink-0 gap-x-3">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

      {/* <button
        type="button"
        onClick={clearQuery}
        className="flex h-10 items-center rounded-lg bg-slate-600 px-4  text-sm   leading-6   text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">clear </span>
      </button> */}
    </div>
  );
}
