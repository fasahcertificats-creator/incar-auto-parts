import { AdminRequestsList } from "@/features/admin/components/AdminRequestsList";

export default function AdminRequestListPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Requests</h1>
      <p className="mt-2 text-sm text-muted">
        Product RFQ, Bulk RFQ, Contact, Private Label, and Catalog Request submissions, most
        recent first.
      </p>

      <div className="mt-6">
        <AdminRequestsList />
      </div>
    </div>
  );
}
