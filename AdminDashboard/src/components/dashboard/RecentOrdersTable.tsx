import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { StatusPill } from "../common/StatusPill";
interface Order {
  id: string;
  date: string;
  customer: string;
  total: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}
interface RecentOrdersTableProps {
  orders: Order[];
}
export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
}) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="flex items-center justify-between border-b p-5">
        <h3 className="font-semibold text-lg">Recent Orders</h3>
        <Link
          href="/orders"
          className="flex items-center text-[#1E40AF] text-sm hover:underline"
        >
          View All <ChevronRightIcon size={16} className="ml-1" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 text-sm">
                  #{order.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                  {order.date}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                  {order.customer}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                  {order.total}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <StatusPill status={order.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-[#1E40AF] hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

