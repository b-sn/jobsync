import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4">
        <Header pageType="auth" />
        <main className="flex flex-1 items-center justify-center px-4 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
