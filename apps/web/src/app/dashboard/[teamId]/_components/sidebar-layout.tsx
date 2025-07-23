'use client';

import type { LucideIcon } from 'lucide-react';
import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BadgePercent,
  BarChart4,
  Columns3,
  Globe,
  Locate,
  Menu,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Users,
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  buttonVariants,
  Separator,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@nx-ddd/ui';
import { cn } from '@nx-ddd/ui-utils';

import { UserButton } from './user-button';

function useSegment(basePath: string) {
  const path = usePathname();
  const result = path.slice(basePath.length, path.length);
  return result ? result : '/';
}

interface Item {
  name: React.ReactNode;
  href: string;
  icon: LucideIcon;
  type: 'item';
}

interface Sep {
  type: 'separator';
}

interface Label {
  name: React.ReactNode;
  type: 'label';
}

type SidebarItem = Item | Sep | Label;

function NavItem(props: {
  item: Item;
  onClick?: () => void;
  basePath: string;
}) {
  const segment = useSegment(props.basePath);
  const selected = segment === props.item.href;

  return (
    <Link
      href={props.basePath + props.item.href}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        selected && 'bg-muted',
        'text-md flex-grow justify-start px-2 text-zinc-800 dark:text-zinc-300',
      )}
      onClick={props.onClick}
      prefetch={true}
    >
      <props.item.icon className="mr-2 h-5 w-5" />
      {props.item.name}
    </Link>
  );
}

function SidebarContent(props: {
  onNavigate?: () => void;
  items: SidebarItem[];
  sidebarTop?: React.ReactNode;
  basePath: string;
}) {
  return (
    <div className="flex h-full flex-col items-stretch">
      <div className="mr-10 flex h-14 shrink-0 items-center border-b px-2 md:mr-0">
        {props.sidebarTop}
      </div>
      <div className="flex flex-grow flex-col gap-2 overflow-y-auto pt-4">
        {props.items.map((item, index) => {
          if (item.type === 'separator') {
            return <Separator key={index} className="my-2" />;
          } else if (item.type === 'item') {
            return (
              <div key={index} className="flex px-2">
                <NavItem
                  item={item}
                  onClick={props.onNavigate}
                  basePath={props.basePath}
                />
              </div>
            );
          } else {
            return (
              <div key={index} className="my-2 flex">
                <div className="flex-grow justify-start px-2 text-sm font-medium text-zinc-500">
                  {item.name}
                </div>
              </div>
            );
          }
        })}

        <div className="flex-grow" />
      </div>
    </div>
  );
}

export interface HeaderBreadcrumbItem {
  title: string;
  href: string;
}

function HeaderBreadcrumb(props: {
  items: SidebarItem[];
  baseBreadcrumb?: HeaderBreadcrumbItem[];
  basePath: string;
}) {
  const segment = useSegment(props.basePath);
  const item = props.items.find(
    (item) => item.type === 'item' && item.href === segment,
  );
  const title: React.ReactNode | undefined =
    item && 'name' in item ? item?.name : undefined;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {props.baseBreadcrumb?.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}

        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const navigationItems: SidebarItem[] = [
  {
    name: 'Overview',
    href: '/',
    icon: Globe,
    type: 'item',
  },
  {
    type: 'label',
    name: 'Management',
  },
  {
    name: 'Products',
    href: '/products',
    icon: ShoppingBag,
    type: 'item',
  },
  {
    name: 'People',
    href: '/people',
    icon: Users,
    type: 'item',
  },
  {
    name: 'Segments',
    href: '/segments',
    icon: Columns3,
    type: 'item',
  },
  {
    name: 'Regions',
    href: '/regions',
    icon: Locate,
    type: 'item',
  },
  {
    type: 'label',
    name: 'Monetization',
  },
  {
    name: 'Revenue',
    href: '/revenue',
    icon: BarChart4,
    type: 'item',
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
    type: 'item',
  },
  {
    name: 'Discounts',
    href: '/discounts',
    icon: BadgePercent,
    type: 'item',
  },
  {
    type: 'label',
    name: 'Settings',
  },
  {
    name: 'Configuration',
    href: '/configuration',
    icon: Settings2,
    type: 'item',
  },
];

export default function SidebarLayout(props: {
  children?: React.ReactNode;
  baseBreadcrumb?: HeaderBreadcrumbItem[];
  sidebarTop?: React.ReactNode;
  basePath: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full">
      <div className="sticky top-0 hidden h-screen w-[240px] flex-col border-r md:flex">
        <SidebarContent
          items={navigationItems}
          sidebarTop={props.sidebarTop}
          basePath={props.basePath}
        />
      </div>
      <div className="flex w-0 flex-grow flex-col">
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4 md:px-6 dark:bg-black">
          <div className="hidden md:flex">
            <HeaderBreadcrumb
              baseBreadcrumb={props.baseBreadcrumb}
              basePath={props.basePath}
              items={navigationItems}
            />
          </div>

          <div className="flex items-center md:hidden">
            <Sheet
              onOpenChange={(open) => setSidebarOpen(open)}
              open={sidebarOpen}
            >
              <SheetTrigger>
                <Menu />
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <SidebarContent
                  onNavigate={() => setSidebarOpen(false)}
                  items={navigationItems}
                  sidebarTop={props.sidebarTop}
                  basePath={props.basePath}
                />
              </SheetContent>
            </Sheet>

            <div className="ml-4 flex md:hidden">
              <HeaderBreadcrumb
                baseBreadcrumb={props.baseBreadcrumb}
                basePath={props.basePath}
                items={navigationItems}
              />
            </div>
          </div>

          <UserButton />
        </div>
        <div className="flex-grow">{props.children}</div>
      </div>
    </div>
  );
}
