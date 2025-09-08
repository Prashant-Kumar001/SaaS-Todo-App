"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  LuCalendar,
  LuCreditCard,
  LuIdCard,
  LuMail,
  LuUser,
  LuPlus,
  LuCircle,
  LuCheck,
} from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { StatCard } from "@/components/dashboard/StatCard";
import { InfoRow } from "@/components/dashboard/InfoRow";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";




export default function OverviewPage() {
  const { user, isLoaded } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { user: User, todos, subscription, loading: Global_loading, error: Eerror } = useSelector(
    (state: RootState) => state.dashboard
  );










  if (Global_loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto space-y-5 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 px-3 py-3 bg-white border bottom-2">
            <div className="flex items-center gap-2">
              <div className="w-56 h-32 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-56 h-32 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-56 h-32 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-6 bg-slate-200 rounded-md w-40 animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-48 animate-pulse"></div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6 min-h-screen">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="user"
          value={User?.email || ""}
          hint={User?.name || ""}
          icon={<LuIdCard className="text-slate-500" />}
          variant="bordered"
        />

        <StatCard
          title="authenticated by Clerk"
          value={user?.firstName ? `${user.firstName}` : "—"}
          hint={
            user?.createdAt
              ? `Joined ${formatDistanceToNow(new Date(user.createdAt), {
                addSuffix: true,
              })}`
              : undefined
          }
          icon={<LuUser className="text-slate-500" />}
          variant="bordered"
        />

        <StatCard
          title="Subscription"
          value={subscription?.plan ?? "No plan"}
          hint={subscription?.status ?? ""}
          icon={<LuCreditCard className="text-slate-500" />}
          variant="bordered"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-800 text-base md:text-lg">
              Clerk info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isLoaded ? (
              <div className="space-y-4 animate-pulse motion-reduce:animate-none">
                <div className="h-6 w-40 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-5/6 rounded bg-slate-200" />
              </div>
            ) : (
              <>
                <InfoRow
                  icon={<LuMail aria-hidden="true" />}
                  label="Email"
                  value={user?.primaryEmailAddress?.emailAddress ?? "—"}
                />
                <InfoRow
                  icon={<LuUser aria-hidden="true" />}
                  label="Name"
                  value={
                    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                    "—"
                  }
                />
                <InfoRow
                  icon={<LuCalendar aria-hidden="true" />}
                  label="Created"
                  value={
                    user?.createdAt
                      ? formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })
                      : "—"
                  }
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-800 text-base md:text-lg">
              DB user & subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Global_loading ? (
              <div className="space-y-4 animate-pulse motion-reduce:animate-none">
                <div className="h-6 w-40 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-5/6 rounded bg-slate-200" />
                <div className="h-48 w-full rounded bg-slate-200" />
              </div>
            ) : User ? (
              <>
                <InfoRow
                  icon={<LuMail aria-hidden="true" />}
                  label="Email"
                  value={User.email ?? "—"}
                />
                <InfoRow
                  icon={<LuUser aria-hidden="true" />}
                  label="Name"
                  value={User.name || "—"}
                />

                {subscription ? (
                  <>
                    <div className="pt-2 border-t border-slate-100" />
                    <InfoRow
                      icon={<LuCreditCard aria-hidden="true" />}
                      label="Plan"
                      value={subscription.plan ?? "—"}
                    />
                    <InfoRow
                      icon={<LuCalendar aria-hidden="true" />}
                      label="Status"
                      value={subscription.status ?? "—"}
                    />
                    {
                      subscription.trialEndsAt && (
                        <InfoRow
                          icon={<LuCalendar aria-hidden="true" />}
                          label="Trial Ends"
                          value={
                            new Date(subscription.trialEndsAt!)?.getTime() && (
                              <div>
                                in{" "}
                                {Math.ceil(
                                  (new Date(subscription.trialEndsAt!).getTime() -
                                    Date.now()) /
                                  (1000 * 60 * 60 * 24)
                                )}{" "}
                                <span>
                                  {Math.ceil(
                                    (new Date(subscription.trialEndsAt!).getTime() -
                                      Date.now()) /
                                    (1000 * 60 * 60 * 24)
                                  ) === 1
                                    ? "day"
                                    : "days"}
                                </span>
                              </div>
                            )
                          }
                        />
                      )
                    }
                  </>
                ) : (
                  <Alert variant="destructive" role="alert" aria-live="polite">
                    <AlertDescription>No subscription found</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Alert role="status" aria-live="polite">
                <AlertDescription>
                  No DB user found. Use Sync (header) to create it.
                </AlertDescription>
              </Alert>
            )}

            {Eerror ? (
              <Alert variant="destructive" role="alert" aria-live="assertive">
                <AlertDescription>{Eerror}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
