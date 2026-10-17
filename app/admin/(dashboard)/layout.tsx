import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#172033]">
      <AdminSidebar />
      <div className="pl-64 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
