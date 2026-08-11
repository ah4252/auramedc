import QcmsAdminClient from "./QcmsAdminClient";
import { getQcmsYears } from "@/app/actions/qcmsAdmin";

export const metadata = {
  title: "إدارة QCMs",
};

export default async function QcmsAdminPage() {
  const initialYears = await getQcmsYears();

  return <QcmsAdminClient initialYears={initialYears} />;
}
