import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LuRefreshCcw } from "react-icons/lu";

type HeaderProps = {
  pathname: string;
  nav: any[];
  syncing: boolean;
  syncNow: () => void;
  isLoaded: boolean;
  has_db: boolean;
  loading: boolean;
};

const Header = ({
  pathname,
  nav,
  syncing,
  syncNow,
  isLoaded,
  has_db,
  loading,
}: HeaderProps) => {
  return (
    <header className="sticky z-20 top-0 border-b border-r border-slate-300 bg-white/70 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="text-sm font-medium text-slate-600">
          {nav.find((n: any) => n.href === pathname)?.label ?? "Overview"}
        </div>

        <div className="flex items-center gap-2">
          {!has_db ? (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={syncNow}
                disabled={!isLoaded || syncing || loading}
                className="relative flex items-center gap-2"
              >
                {syncing || loading ? (
                  <>
                    <LuRefreshCcw className="animate-spin" size={16} />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <LuRefreshCcw size={16} />
                    <span>Sync</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div>
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="cursor-default bg-green-100 text-green-700 hover:bg-green-100"
              >
                ✅ Synced
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
