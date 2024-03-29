import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import SideNav from '../ui/dashboard/sidenav';
import ProfileLogin from '../ui/dashboard/ProfileLogin';
import { auth, signOut } from '@/auth';
import { ToastProvider } from '../ui/providers/toast-provider';
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>

      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <ToastProvider />
        {children}
      </div>
    </div>
  );
}
