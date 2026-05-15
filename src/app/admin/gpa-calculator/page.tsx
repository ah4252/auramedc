import { getGPAYears } from "@/app/actions/gpaAdmin";
import GpaAdminClient from "./GpaAdminClient";

export const dynamic = "force-dynamic";

export default async function GpaCalculatorAdminPage() {
  const gpaYears = await getGPAYears();

  return <GpaAdminClient initialYears={JSON.parse(JSON.stringify(gpaYears))} />;
}
