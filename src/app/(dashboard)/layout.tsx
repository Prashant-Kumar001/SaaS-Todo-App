"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { userClient } from "@/lib/userClient";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/dashboard/Header";
import Sidebar, { nav } from "@/components/dashboard/sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  setDashboardData,
  setLoading,
  setError,
  setHas_db,
} from "@/lib/store/slices/meSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [syncing, setSyncing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { Has_db, loading } = useSelector(
    (state: RootState) => state.dashboard
  );

  const fetchAll = async () => {
    if (!user?.id) return;
    dispatch(setError(""));
    try {
      const result = await userClient.me();
      if (result.success && result.data) {
        dispatch(setHas_db(true));
        dispatch(setDashboardData(result.data));
      } else {
        dispatch(setHas_db(false));
        dispatch(setError(result.error || "Failed to fetch"));
      }
      if (result.error) dispatch(setError(result.error || "Failed to fetch"));
    } catch (e: any) {
      dispatch(setHas_db(false));
      dispatch(setError(e.error || "Failed to fetch"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user?.id]);

  const syncNow = async () => {
    try {
      setSyncing(true);
      const result = await userClient.syncUser();


      if (result.success) {
        dispatch(setDashboardData(result.data));
        dispatch(setHas_db(true));
        toast.success("Sync successful");
      } 
      
      if (result.error) {
        throw new Error(result.error ?? "Failed to upgrade plan");
      }

    } catch (e: any) {
      dispatch(setHas_db(false));
      dispatch(setError(e.error || "Failed to fetch"));
      toast.error(e.message || "Failed to sync");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 md:grid-cols-[260px_1fr]">
        <Sidebar pathname={pathname} />
        <main className="flex h-screen flex-col">
          <Header
            pathname={pathname}
            nav={nav}
            syncing={syncing}
            syncNow={syncNow}
            isLoaded={isLoaded}
            has_db={Has_db}
            loading={loading}
          />
          <div className="mx-auto border-r overflow-auto border-slate-300 w-full max-w-5xl flex-1 p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
