import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-sm text-stone-600">
      <ol className="flex flex-wrap items-center gap-2">
        <li className="flex items-center gap-1">
          <Link href="/" className="hover:text-rose-600 flex items-center gap-1 transition">
            <Home className="w-3.5 h-3.5" />
            <span>होम</span>
          </Link>
          {items.length > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-400 mx-1" />}
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-rose-600 transition">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-stone-900 font-medium truncate max-w-xs sm:max-w-md' : 'text-stone-600'}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="w-3.5 h-3.5 text-stone-400 mx-1" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
