import { Open_Sans } from 'next/font/google';
import './globals.css';
import { CompanyProvider } from './context/CompanyContext';
import { SidebarProvider } from './context/SidebarContext';

const openSans = Open_Sans({ subsets: ['latin'], display:'swap' });

export const metadata = {
  title: 'Recos Dashboard',
  description: 'Recruitment Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <CompanyProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </CompanyProvider>
      </body>
    </html>
  );
}