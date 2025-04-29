"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusPill } from "@/components/common/StatusPill";
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  MailIcon,
  PrinterIcon,
  TruckIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();
  // In a real application, you would fetch order data based on the ID
  const order = {
    id,
    date: "2023-06-01 14:30",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "4242",
      status: "Paid",
      date: "2023-06-01 14:35",
    },
    items: [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        price: "$149.99",
        quantity: 1,
        total: "$149.99",
        sku: "HDX-100",
      },
      {
        id: "2",
        name: "Wireless Charging Pad",
        price: "$29.99",
        quantity: 2,
        total: "$59.98",
        sku: "CHG-PAD-01",
      },
    ],
    subtotal: "$209.97",
    shipping: "$9.99",
    tax: "$17.50",
    discount: "-$20.00",
    total: "$217.46",
    status: "shipped" as const,
    timeline: [
      {
        date: "2023-06-01 14:30",
        status: "Order Placed",
        icon: <ClockIcon size={16} />,
      },
      {
        date: "2023-06-01 14:35",
        status: "Payment Received",
        icon: <CheckIcon size={16} />,
      },
      {
        date: "2023-06-02 09:20",
        status: "Processing",
        icon: <ClockIcon size={16} />,
      },
      {
        date: "2023-06-03 11:15",
        status: "Shipped",
        icon: <TruckIcon size={16} />,
      },
    ],
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/orders"
            className="mr-4 rounded-md p-1 hover:bg-gray-100"
          >
            <ArrowLeftIcon size={20} />
          </Link>
          <h1 className="font-bold text-2xl">Order #{id}</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={<PrinterIcon size={16} />}>
            Print
          </Button>
          <Button icon={<MailIcon size={16} />}>Email Invoice</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="mb-4 flex flex-col border-b pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-lg">Order Status</h3>
                  <StatusPill status={order.status} />
                </div>
                <p className="text-gray-500 text-sm">Placed on {order.date}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <select
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  defaultValue={order.status}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>{order.customer.name}</p>
                    <p>{order.customer.email}</p>
                    <p>{order.customer.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Shipping Address</h4>
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Payment Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    {order.payment.method} ending in {order.payment.cardLast4}
                  </p>
                  <p>
                    {order.payment.status} on {order.payment.date}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="mb-4 font-medium text-lg">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900 text-sm">
                          {item.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          SKU: {item.sku}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                        {item.price}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between py-1">
                <span className="text-gray-500 text-sm">Subtotal</span>
                <span className="text-sm">{order.subtotal}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 text-sm">Shipping</span>
                <span className="text-sm">{order.shipping}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 text-sm">Tax</span>
                <span className="text-sm">{order.tax}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 text-sm">Discount</span>
                <span className="text-red-600 text-sm">{order.discount}</span>
              </div>
              <div className="mt-2 flex justify-between border-t py-2 font-bold">
                <span>Total</span>
                <span>{order.total}</span>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="mb-4 font-medium text-lg">Notes</h3>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              rows={3}
              placeholder="Add a note about this order..."
            />
            <div className="mt-2">
              <Button>Add Note</Button>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 font-medium text-lg">Order Timeline</h3>
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex">
                  <div className="mr-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${index === order.timeline.length - 1 ? "bg-[#1E40AF] text-white" : "bg-gray-100"}`}
                    >
                      {event.icon}
                    </div>
                    {index < order.timeline.length - 1 && (
                      <div className="mx-auto h-8 w-px bg-gray-200" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{event.status}</p>
                    <p className="text-gray-500 text-xs">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="mb-4 font-medium text-lg">Quick Actions</h3>
            <div className="space-y-3">
              <Button fullWidth icon={<TruckIcon size={16} />}>
                Update Tracking
              </Button>
              <Button fullWidth variant="outline" icon={<MailIcon size={16} />}>
                Contact Customer
              </Button>
              <Button fullWidth variant="danger" icon={<XIcon size={16} />}>
                Cancel Order
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
