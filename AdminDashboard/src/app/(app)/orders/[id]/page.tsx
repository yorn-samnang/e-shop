'use client'

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusPill } from "@/components/common/StatusPill";
import { ClockIcon, CheckIcon, TruckIcon, ArrowLeftIcon, PrinterIcon, MailIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailPage   ()  {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  // In a real application, you would fetch order data based on the ID
  const order = {
    id,
    date: '2023-06-01 14:30',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567'
    },
    shipping: {
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'United States'
    },
    payment: {
      method: 'Credit Card',
      cardLast4: '4242',
      status: 'Paid',
      date: '2023-06-01 14:35'
    },
    items: [{
      id: '1',
      name: 'Premium Wireless Headphones',
      price: '$149.99',
      quantity: 1,
      total: '$149.99',
      sku: 'HDX-100'
    }, {
      id: '2',
      name: 'Wireless Charging Pad',
      price: '$29.99',
      quantity: 2,
      total: '$59.98',
      sku: 'CHG-PAD-01'
    }],
    subtotal: '$209.97',
    shipping: '$9.99',
    tax: '$17.50',
    discount: '-$20.00',
    total: '$217.46',
    status: 'shipped' as const,
    timeline: [{
      date: '2023-06-01 14:30',
      status: 'Order Placed',
      icon: <ClockIcon size={16} />
    }, {
      date: '2023-06-01 14:35',
      status: 'Payment Received',
      icon: <CheckIcon size={16} />
    }, {
      date: '2023-06-02 09:20',
      status: 'Processing',
      icon: <ClockIcon size={16} />
    }, {
      date: '2023-06-03 11:15',
      status: 'Shipped',
      icon: <TruckIcon size={16} />
    }]
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/orders" className="mr-4 p-1 rounded-md hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Order #{id}</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={<PrinterIcon size={16} />}>
            Print
          </Button>
          <Button icon={<MailIcon size={16} />}>Email Invoice</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4">
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">Order Status</h3>
                  <StatusPill status={order.status} className="ml-2" />
                </div>
                <p className="text-sm text-gray-500">Placed on {order.date}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={order.status}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="text-sm space-y-1">
                    <p>{order.customer.name}</p>
                    <p>{order.customer.email}</p>
                    <p>{order.customer.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-sm space-y-1">
                    <p>{order.shipping.address}</p>
                    <p>
                      {order.shipping.city}, {order.shipping.state}{' '}
                      {order.shipping.zipCode}
                    </p>
                    <p>{order.shipping.country}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Payment Information</h4>
                <div className="text-sm space-y-1">
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
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map(item => <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.sku}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {item.total}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm">{order.subtotal}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-500">Shipping</span>
                <span className="text-sm">{order.shipping}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-500">Tax</span>
                <span className="text-sm">{order.tax}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-500">Discount</span>
                <span className="text-sm text-red-600">{order.discount}</span>
              </div>
              <div className="flex justify-between py-2 font-bold border-t mt-2">
                <span>Total</span>
                <span>{order.total}</span>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-medium mb-4">Notes</h3>
            <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" rows={3} placeholder="Add a note about this order..." />
            <div className="mt-2">
              <Button>Add Note</Button>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {order.timeline.map((event, index) => <div key={index} className="flex">
                  <div className="mr-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${index === order.timeline.length - 1 ? 'bg-[#1E40AF] text-white' : 'bg-gray-100'}`}>
                      {event.icon}
                    </div>
                    {index < order.timeline.length - 1 && <div className="w-px h-8 bg-gray-200 mx-auto"></div>}
                  </div>
                  <div>
                    <p className="font-medium">{event.status}</p>
                    <p className="text-xs text-gray-500">{event.date}</p>
                  </div>
                </div>)}
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
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
    </div>;
};
