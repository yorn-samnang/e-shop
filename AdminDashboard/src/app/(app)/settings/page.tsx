"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StoreIcon, CreditCardIcon, MailIcon, PercentIcon, TruckIcon, SaveIcon } from "lucide-react";
import { useState } from "react";

export default function SettingsPage  ()  {
  const [activeTab, setActiveTab] = useState('store');
  const tabs = [{
    id: 'store',
    label: 'Store Settings',
    icon: <StoreIcon size={16} />
  }, {
    id: 'payment',
    label: 'Payment Gateways',
    icon: <CreditCardIcon size={16} />
  }, {
    id: 'email',
    label: 'Email Templates',
    icon: <MailIcon size={16} />
  }, {
    id: 'tax',
    label: 'Tax Settings',
    icon: <PercentIcon size={16} />
  }, {
    id: 'shipping',
    label: 'Shipping Options',
    icon: <TruckIcon size={16} />
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button icon={<SaveIcon size={16} />}>Save Changes</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-1">
              {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-3 rounded-md w-full text-left ${activeTab === tab.id ? 'bg-[#1E40AF] bg-opacity-10 text-[#1E40AF]' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <span className="mr-3">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>)}
            </nav>
          </Card>
        </div>
        <div className="lg:col-span-3">
          {activeTab === 'store' && <Card>
              <h2 className="text-lg font-medium mb-6">Store Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="My Awesome Store" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Logo
                  </label>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center mr-4">
                      <StoreIcon size={24} className="text-gray-500" />
                    </div>
                    <Button variant="outline" size="sm">
                      Upload New Logo
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Currency
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="USD">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Language
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="en-US">
                    <option value="en-US">English (United States)</option>
                    <option value="en-GB">English (United Kingdom)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Address
                  </label>
                  <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" rows={3} defaultValue="123 Main St, Anytown, CA 12345, United States" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="contact@mystore.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input type="tel" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
            </Card>}
          {activeTab === 'payment' && <Card>
              <h2 className="text-lg font-medium mb-6">
                Payment Gateway Settings
              </h2>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input id="stripe" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                      <label htmlFor="stripe" className="ml-2 block text-sm font-medium text-gray-900">
                        Stripe
                      </label>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Publishable Key
                      </label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="pk_test_..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secret Key
                      </label>
                      <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="sk_test_..." />
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input id="paypal" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" />
                      <label htmlFor="paypal" className="ml-2 block text-sm font-medium text-gray-900">
                        PayPal
                      </label>
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      Inactive
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client ID
                      </label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" placeholder="Enter PayPal client ID" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Secret
                      </label>
                      <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" placeholder="Enter PayPal client secret" />
                    </div>
                  </div>
                </div>
                <Button>Add Payment Gateway</Button>
              </div>
            </Card>}
          {activeTab === 'email' && <Card>
              <h2 className="text-lg font-medium mb-6">Email Templates</h2>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Order Confirmation</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="Your order #{{order_number}} has been confirmed" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Template
                      </label>
                      <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent font-mono text-sm" rows={8} defaultValue={`Dear {{customer_name}},
Thank you for your order! We've received your order #{{order_number}} and it is now being processed.
Order Details:
{{order_items}}
Total: {{order_total}}
We'll send you another email when your order ships.
Thank you for shopping with us!
Best regards,
The Team at My Awesome Store`} />
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm">Test Email</Button>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Shipping Confirmation</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="Your order #{{order_number}} has shipped" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Template
                      </label>
                      <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent font-mono text-sm" rows={8} defaultValue={`Dear {{customer_name}},
Great news! Your order #{{order_number}} has been shipped.
Tracking Number: {{tracking_number}}
Carrier: {{shipping_carrier}}
Estimated Delivery: {{delivery_date}}
Order Details:
{{order_items}}
Thank you for shopping with us!
Best regards,
The Team at My Awesome Store`} />
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm">Test Email</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>}
          {activeTab === 'tax' && <Card>
              <h2 className="text-lg font-medium mb-6">Tax Settings</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-4">
                    <input id="enable-tax" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                    <label htmlFor="enable-tax" className="ml-2 block text-sm font-medium text-gray-900">
                      Enable Tax Calculations
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Calculation Based On
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue="shipping">
                    <option value="shipping">Customer Shipping Address</option>
                    <option value="billing">Customer Billing Address</option>
                    <option value="store">Store Address</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-md font-medium mb-3">Tax Rates</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">
                          United States - California
                        </h4>
                        <span className="text-sm">7.25%</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Applies to: All products
                      </div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">
                          United States - New York
                        </h4>
                        <span className="text-sm">8.875%</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Applies to: All products
                      </div>
                    </div>
                    <Button>Add Tax Rate</Button>
                  </div>
                </div>
              </div>
            </Card>}
          {activeTab === 'shipping' && <Card>
              <h2 className="text-lg font-medium mb-6">Shipping Options</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-4">
                    <input id="enable-shipping" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                    <label htmlFor="enable-shipping" className="ml-2 block text-sm font-medium text-gray-900">
                      Enable Shipping
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium mb-3">Shipping Methods</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <input id="standard-shipping" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                          <label htmlFor="standard-shipping" className="ml-2 block font-medium">
                            Standard Shipping
                          </label>
                        </div>
                        <span className="text-sm">$9.99</span>
                      </div>
                      <div className="text-sm text-gray-500 ml-6">
                        Delivery in 5-7 business days
                      </div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <input id="express-shipping" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                          <label htmlFor="express-shipping" className="ml-2 block font-medium">
                            Express Shipping
                          </label>
                        </div>
                        <span className="text-sm">$19.99</span>
                      </div>
                      <div className="text-sm text-gray-500 ml-6">
                        Delivery in 2-3 business days
                      </div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <input id="free-shipping" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                          <label htmlFor="free-shipping" className="ml-2 block font-medium">
                            Free Shipping
                          </label>
                        </div>
                        <span className="text-sm">$0.00</span>
                      </div>
                      <div className="text-sm text-gray-500 ml-6">
                        For orders over $100.00
                      </div>
                    </div>
                    <Button>Add Shipping Method</Button>
                  </div>
                </div>
              </div>
            </Card>}
        </div>
      </div>
    </div>;
};
