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

];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-background/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" aria-label="go home" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-foreground" />
            <span className="text-lg font-medium tracking-tight text-foreground">
              Questfully
            </span>
          </Link>
          <p className="text-sm text-muted-foreground/80">
            © {new Date().getFullYear()} Questfully. All rights reserved.
          </p>
        </div>

        <div className="flex gap-8">
          {links.map((group) => (
            <div key={group.group} className="flex gap-6">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
