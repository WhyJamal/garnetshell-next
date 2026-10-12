"use client";
import { useState } from "react";
import { footerItems } from "@config/footer.config";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Logo, LogoType } from "../logo";

export function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer className="w-full border-t text-sm text-gray-500 dark:text-white/70">

      <div className="hidden md:grid max-w-5xl mx-auto px-4 py-10 grid-cols-5 gap-8">
        
        <Logo logo={LogoType.secondary} />

        {footerItems.map((item) => (
          <div key={item.title}>
            <h4 className="text-gray-900 font-medium mb-3 dark:text-white">
              {item.title}
            </h4>

            <ul className="space-y-2">
              {item.links.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:underline">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="md:hidden">
        {footerItems.map((item, index) => (
          <div key={item.title} className="border-b">

            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center px-4 py-1.5 text-left text-gray-900 dark:text-white"
            >
              <span>{item.title}</span>
              <ChevronDown className={`w-5 text-gray-600 ${openIndex === index && "rotate-180"}`} />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40" : "max-h-0"
                }`}
            >
              <ul className="px-4 pb-3 space-y-2">
                {item.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="block py-1"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

      <div className="border-t">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p>© 2026 <span className="text-black dark:text-white">Garnet</span><span className="text-red-700">shell</span>. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}