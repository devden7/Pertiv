'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import BookMode from '@/components/shared/BookMode';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  const pathname = usePathname();
  const splitPathname = pathname.split('/');
  return (
    <header className="flex  h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex justify-between w-full items-center gap-2 px-4">
        <div className="flex gap-2 items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/staff"> Staff</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathname !== '/staff' && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
              {pathname !== '/staff' && (
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {splitPathname[2]}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <BookMode />
      </div>
    </header>
  );
};

export default Header;
