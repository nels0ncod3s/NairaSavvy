"use client";
import { useLayoutEffect, useRef } from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  ["Savings", "/savings"],
  ["Fight Back", "/fight-back"],
  ["Grow", "/grow"],
  ["Cut Costs", "/cut-costs"],
  ["Articles", "/articles"],
  ["Search", "/search"],
];
function PendingHint() {
  const { pending } = useLinkStatus();
  return (
    <span
      className={`nav-pending${pending ? " is-pending" : ""}`}
      aria-hidden="true"
    />
  );
}
export default function Nav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const scrollTarget = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (scrollTarget.current === pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    scrollTarget.current = null;
  }, [pathname]);
  function startNavigation(href: string) {
    dialog.current?.close();
    if (pathname === href) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else {
      scrollTarget.current = href;
    }
  }
  function close() {
    dialog.current?.close();
  }
  return (
    <>
      <nav className="main-nav" aria-label="Main navigation">
        <Link
          className="wordmark"
          href="/"
          scroll={false}
          onNavigate={() => startNavigation("/")}
        >
          <span className="brand-mark" aria-hidden="true">
            ₦
          </span>
          NairaSavvy<span className="brand-period">.</span>
        </Link>
        <div className="desktop-nav">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              scroll={false}
              onNavigate={() => startNavigation(href)}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
              <PendingHint />
            </Link>
          ))}
          <Link
            className="btn-primary"
            href="/newsletter"
            scroll={false}
            onNavigate={() => startNavigation("/newsletter")}
          >
            Get Free Alerts <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <button
          ref={trigger}
          className="mobile-menu-button"
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
        >
          <Menu />
        </button>
      </nav>
      <dialog
        className="mobile-nav"
        ref={dialog}
        aria-labelledby="menu-title"
        onClose={() => trigger.current?.focus({ preventScroll: true })}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const items = dialog.current?.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          );
          if (!items?.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="mobile-nav-header">
          <h2 id="menu-title">NairaSavvy</h2>
          <button
            className="text-button"
            aria-label="Close navigation menu"
            onClick={close}
          >
            <X />
          </button>
        </div>
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            scroll={false}
            onNavigate={() => startNavigation(href)}
            onClick={close}
            aria-current={pathname === href ? "page" : undefined}
          >
            {label}
            <PendingHint />
          </Link>
        ))}
        <Link
          className="btn-primary"
          href="/newsletter"
          scroll={false}
          onNavigate={() => startNavigation("/newsletter")}
          onClick={close}
        >
          Get Free Alerts <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </dialog>
    </>
  );
}
