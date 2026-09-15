"use client";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
const links = [
  ["Savings", "/savings"],
  ["Fight Back", "/fight-back"],
  ["Grow", "/grow"],
  ["Cut Costs", "/cut-costs"],
  ["Articles", "/articles"],
  ["Search", "/search"],
];
export default function Nav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  function close() {
    dialog.current?.close();
  }
  return (
    <>
      <nav className="main-nav" aria-label="Main navigation">
        <Link className="wordmark" href="/">
          NairaSavvy
        </Link>
        <div className="desktop-nav">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link className="btn-primary" href="/newsletter">
            Get Free Alerts
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
        onClose={() => trigger.current?.focus()}
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
            onClick={close}
            aria-current={pathname === href ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
        <Link className="btn-primary" href="/newsletter" onClick={close}>
          Get Free Alerts
        </Link>
      </dialog>
    </>
  );
}
