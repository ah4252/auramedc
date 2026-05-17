import { getRecoveryRequests } from "@/app/actions/recovery";
import RecoveryClient from "./RecoveryClient";

export default async function RecoveryAdminPage() {
  const res = await getRecoveryRequests();
  const requests = res.success ? res.requests || [] : [];

  return <RecoveryClient initialRequests={requests} />;
}
