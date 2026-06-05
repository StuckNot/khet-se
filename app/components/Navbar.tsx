/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Main Navigation Bar                                                │
 * │  File: app/components/Navbar.tsx                                             │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Responsive top navigation bar. Includes links, auth state toggling (Login   │
 * │  vs Account/Signout), and the Cart toggle button with an item count badge.   │
 * │                                                                              │
 * │  WHY "use client"?                                                           │
 * │  It uses React state for the mobile hamburger menu and consumes the Zustand  │
 * │  cart store to display the dynamic item count badge.                         │
 * │                                                                              │
 * │  PROPS:                                                                      │
 * │  - user: The Supabase User object, passed down from the root layout (RSC)    │
 * │    to determine auth state without doing a client-side fetch.                │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { signout } from "../(shop)/login/actions";
import { useCartStore } from "@/store/cartStore";

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getItemCount, toggleDrawer } = useCartStore();
  const itemCount = getItemCount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Shop All", href: "/shop" },
    { name: "Our Story", href: "/story" },
    { name: "Trial Kits", href: "/trial-kits", highlight: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-primary/10 bg-brand-canvas py-4 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight text-brand-primary">
            KhetSe
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:opacity-80 ${
                  link.highlight ? "text-brand-accent font-bold" : "text-brand-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-5">
            {/* Account Logic */}
            {user ? (
              <div className="flex items-center space-x-5">
                <Link
                  href="/account"
                  className="text-brand-primary transition-opacity hover:opacity-80 flex items-center gap-2"
                  aria-label="Account"
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden lg:inline text-xs font-medium">My Account</span>
                </Link>
                <form action={signout}>
                  <button
                    type="submit"
                    className="text-xs font-bold text-brand-primary/60 hover:text-brand-primary transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-bold text-brand-primary border-2 border-brand-primary px-4 py-1.5 rounded-md hover:bg-brand-primary hover:text-brand-canvas transition-all"
              >
                Log In
              </Link>
            )}

            <button
              onClick={() => toggleDrawer()}
              className="relative text-brand-primary transition-opacity hover:opacity-80" 
              aria-label="Cart"
            >
              <BagIcon className="h-6 w-6" />
              {mounted && itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-secondary text-[10px] font-bold text-brand-canvas">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="block md:hidden text-brand-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="mt-4 flex flex-col space-y-4 pb-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-lg font-medium transition-colors ${
                  link.highlight ? "text-brand-accent" : "text-brand-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-brand-primary/10" />
            
            {user ? (
              <>
                <Link 
                  href="/account" 
                  className="text-lg font-medium text-brand-primary" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <form action={signout} onSubmit={() => setIsMenuOpen(false)}>
                  <button
                    type="submit"
                    className="text-lg font-medium text-red-600"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link 
                href="/login" 
                className="text-lg font-bold text-brand-secondary" 
                onClick={() => setIsMenuOpen(false)}
              >
                Log In / Join
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// --- Icons ---

const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export default Navbar;
