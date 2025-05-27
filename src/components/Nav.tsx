import { useLocation, createAsync, A, useIsRouting } from "@solidjs/router";
import { JSXElement, createSignal, Show, onMount, createEffect } from "solid-js";
import { getUser, logout } from "../lib/login";
import { isServer } from "solid-js/web";

type NavLinkProps = {
  href: string;
  children: JSXElement;
};
function NavLink(props: NavLinkProps) {
  const location = useLocation();
  const active = (path: string) =>
    path === location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <li class={`border-b-2 ${active(props.href)} mx-1.5 sm:mx-6`}>
      <A href={props.href}>{props.children}</A>
    </li>
  );
}

export default function Nav() {
  const user = createAsync(() => getUser().catch(() => null), { deferStream: true });
  const isRouting = useIsRouting();

  return (
    <>
      {/* Loading indicator for client-side navigation */}
      <Show when={isRouting()}>
        <div class="bg-yellow-100 text-yellow-800 text-center p-1 fixed top-0 left-0 w-full z-50">
          Loading...
        </div>
      </Show>
      
      <nav class="bg-sky-800">
        <ul class="container flex items-center p-3 text-gray-200">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/rostersTemplate">Templates</NavLink>
          <NavLink href="/myRosters">myRosters</NavLink>
          <NavLink href="/login">Login</NavLink>
          

        </ul>
      </nav>
    </>
  );
}