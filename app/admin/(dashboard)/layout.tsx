import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#FAFAFC] text-[#172033]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
