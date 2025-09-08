import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import {
  LuCreditCard,
  LuLayoutDashboard,
  LuListTodo,
  LuUser,
} from "react-icons/lu";
import { Button } from "../ui/button";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export const nav = [
  { href: "/overview", label: "Overview", icon: LuLayoutDashboard },
  { href: "/user", label: "User", icon: LuUser },
  { href: "/subscription", label: "Subscription", icon: LuCreditCard },
  { href: "/todos", label: "Todos", icon: LuListTodo },
];

const Sidebar = ({ pathname }: { pathname: string }) => {

    const loader = useSelector((state: RootState) => state.dashboard.loading);

  return (
    <aside className="md:sticky overflow-x-scroll z-20 top-0 border-r border-b border-slate-300 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="px-5 py-4">
        <div className="text-xl font-semibold tracking-tight text-slate-800">
          Dashboard
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Manage account & tasks
        </div>
      </div>
      <Separator />
      <nav className="p-2">
        {nav.map((item: any) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Button  key={item.href} variant={active ? "default" : "ghost"} disabled={loader} >
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
                key={item.href}
                href={item.href}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="mt-auto p-3 hidden md:block">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          Tip: Use Overview to see a snapshot of account & tasks.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
