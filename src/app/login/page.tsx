import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validSession } from "@/lib/ticketing/security";
import { Brand, Poster } from "@/components/ticketing/brand";
import { Login } from "@/components/ticketing/login";
export const dynamic = "force-dynamic";
export default async function LoginPage() {
  if (validSession((await cookies()).get("cavic_session")?.value))
    redirect("/dashboard");
  const configured = Boolean(
    process.env.ADMIN_EMAIL &&
    (process.env.ADMIN_PASSWORD?.length || 0) >= 12 &&
    (process.env.AUTH_SECRET?.length || 0) >= 32,
  );
  return (
    <div className="cavic-ticketing login-page">
      <div className="login-left">
        <Brand />
        <Login configured={configured} />
        <p className="eyebrow">CREATIVITY. TECHNOLOGY. CULTURE.</p>
      </div>
      <div className="login-art">
        <Poster />
      </div>
    </div>
  );
}
