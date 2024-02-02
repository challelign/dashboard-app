import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-20 rotate-[15deg] " />
      <p className="  content-center justify-center text-[30px]   sm:text-[20px]  md:text-[20px] ">
        Full-stack app
      </p>
    </div>
  );
}
