import { useLocation, createAsync, A } from "@solidjs/router";
import { JSXElement, createSignal, Show, onMount, createEffect } from "solid-js";
import { getUser } from "../lib/login";

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
  const placeholdr = true

  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/rostersTemplate">Template</NavLink>

        <Show when={placeholdr}>
          <NavLink href="/login">Login</NavLink>
        </Show>

      </ul>
    </nav>
  );
}