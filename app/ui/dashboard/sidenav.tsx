import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut, auth } from '@/auth';
import Image from 'next/image';
import ProfileLogin from './ProfileLogin';

export default async function SideNav() {
  const loginInfo = await auth();

  // console.log(loginInfo?.user?.name);
  // console.log(loginInfo?.user?.email);

  const handleSignOut = async () => {
    'use server';
    await signOut();
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        // className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-500 p-4"
        href="/"
      >
        <div className=" w-80 text-white md:w-60">
          <AcmeLogo />
        </div>
      </Link>
      <ProfileLogin
        user={loginInfo?.user?.name}
        onClickLogout={handleSignOut}
      />
      <br />
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">
              <div className="mb-2 flex items-center">
                <div className="flex items-center gap-3">
                  <Image
                    src="/customers/guillermo-rauch.png"
                    className="rounded-full"
                    alt={`${loginInfo?.user?.name}'s profile picture`}
                    width={28}
                    height={28}
                  />
                  {/* <p>{loginInfo?.user?.name}</p> */}
                  Sign Out
                </div>
              </div>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
