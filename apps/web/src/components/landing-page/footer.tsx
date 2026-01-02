import Link from "next/link";

import { Logo } from "@/components/icons/logo";

const links = [
  // {
  //   group: "Product",
  //   items: [
  //     {
  //       title: "Features",
  //       href: "#",
  //     },
  //     {
  //       title: "Pricing",
  //       href: "#",
  //     },
  //   ],
  // },
  {
    group: "Resources",
    items: [
      {
        title: "Privacy",
        href: "/privacy",
      },
      {
        title: "Terms",
        href: "/terms",
      },
    ],
  },
  {
    group: "Company",
    items: [
      // {
      //   title: "About",
      //   href: "#",
      // },
      // {
      //   title: "Blog",
      //   href: "/blog",
      // },
      // {
      //   title: "Contact",
      //   href: "#",
      // },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-white pt-20 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="space-y-6 md:col-span-3">
            <Link href="/" aria-label="go home" className="block size-fit">
              <Logo className="h-6" />
            </Link>


          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:col-span-2">
            {links.map((link, index) => (
              <div key={index} className="space-y-4 text-sm">
                <span className="block font-medium">{link.group}</span>
                {link.items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block text-muted-foreground duration-150 hover:text-primary"
                  >
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 h-1 w-full rounded-full bg-neutral-500/5 md:mt-12" />
        <div className="flex flex-wrap items-end justify-between gap-6 py-6">
          <span className="order-last block text-center text-sm text-muted-foreground md:order-first">
            © Questfully, All rights reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last"></div>
        </div>
      </div>
    </footer>
  );
}
