import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validSession } from "@/lib/ticketing/security";
import { dashboardData } from "@/lib/ticketing/admin";
import { Dashboard } from "@/components/ticketing/dashboard";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  if (!validSession((await cookies()).get("cavic_session")?.value))
    redirect("/login");
  return <Dashboard initial={await dashboardData()} />;
}
