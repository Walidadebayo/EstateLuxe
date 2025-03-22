"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardActions,
} from "@progress/kendo-react-layout";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartLegend,
  ChartTooltip,
} from "@progress/kendo-react-charts";
import { Button } from "@progress/kendo-react-buttons";
import {
  ArrowRight,
  Home,
  BarChart,
  Users,
  Calendar,
  Building,
  CreditCard,
  ActivitySquare,
} from "lucide-react";

import { mockProperties, mockTenants, mockPayments } from "@/lib/mock-data";
import { SvgIcon } from "@progress/kendo-react-common";
import { arrowRightIcon, homeIcon } from "@progress/kendo-svg-icons";
import Link from "next/link";

const revenueData = [
  { month: "Jan", amount: 12500 },
  { month: "Feb", amount: 13200 },
  { month: "Mar", amount: 14100 },
  { month: "Apr", amount: 13800 },
  { month: "May", amount: 15200 },
  { month: "Jun", amount: 16500 },
  { month: "Jul", amount: 17100 },
  { month: "Aug", amount: 16800 },
  { month: "Sep", amount: 17500 },
  { month: "Oct", amount: 18300 },
  { month: "Nov", amount: 19000 },
  { month: "Dec", amount: 19500 },
];

const occupancyData = [
  { category: "Occupied", value: 85 },
  { category: "Vacant", value: 15 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    tenants: 0,
    totalRent: 0,
    occupancyRate: 0,
    pendingMaintenance: 8,
    overdueTenants: 0,
  });

  useEffect(() => {
    // Calculate dashboard statistics
    const properties = mockProperties.length;
    const tenants = mockTenants.length;
    const totalRent = mockTenants.reduce(
      (sum, tenant) => sum + tenant.rentAmount,
      0,
    );
    const overduePayments = mockPayments.filter(
      (p) => p.status === "Overdue",
    ).length;

    setStats({
      properties,
      tenants,
      totalRent,
      occupancyRate: 85, // Mock data - would calculate from actual occupancy
      pendingMaintenance: 8, // Mock data
      overdueTenants: overduePayments,
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Properties"
          value={stats.properties}
          icon={<Building className="text-blue-600" />}
          link="/dashboard/properties"
        />
        <StatsCard
          title="Tenants"
          value={stats.tenants}
          icon={<Users className="text-green-600" />}
          link="/dashboard/tenants"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats.totalRent.toLocaleString()}`}
          icon={<CreditCard className="text-purple-600" />}
          link="/dashboard/payments"
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={<Home className="text-orange-600" />}
          link="/dashboard/reports"
        />
        <StatsCard
          title="Pending Maintenance"
          value={stats.pendingMaintenance}
          icon={<ActivitySquare className="text-red-600" />}
          link="/dashboard/maintenance"
        />
        <StatsCard
          title="Overdue Payments"
          value={stats.overdueTenants}
          icon={<Calendar className="text-yellow-600" />}
          link="/dashboard/payments"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Revenue Trend</h2>
              <Button startIcon={<BarChart size={16} />} fillMode="flat">
                Reports
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Chart style={{ height: 300 }}>
              <ChartSeries>
                <ChartSeriesItem
                  type="column"
                  data={revenueData}
                  field="amount"
                  categoryField="month"
                  color="#4338ca"
                />
              </ChartSeries>
              <ChartTooltip />
            </Chart>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Occupancy Rate</h2>
              <Button startIcon={<SvgIcon icon={homeIcon} />} fillMode="flat">
                Properties
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Chart style={{ height: 300 }}>
              <ChartLegend position="bottom" />
              <ChartSeries>
                <ChartSeriesItem
                  type="donut"
                  data={occupancyData}
                  field="value"
                  categoryField="category"
                  labels={{
                    visible: true,
                    content: (e) => `${e.value}%`,
                  }}
                />
              </ChartSeries>
              <ChartTooltip />
            </Chart>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="border-b">
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <ActivityItem
              title="New Tenant"
              description="John Smith signed a lease for Apt 302"
              date="2 hours ago"
              type="tenant"
            />
            <ActivityItem
              title="Payment Received"
              description="$1,250.00 payment received from Sarah Johnson"
              date="5 hours ago"
              type="payment"
            />
            <ActivityItem
              title="Maintenance Request"
              description="Plumbing issue reported in Unit 205"
              date="Yesterday"
              type="maintenance"
            />
            <ActivityItem
              title="Lease Expiring"
              description="David Wilson's lease expires in 15 days"
              date="2 days ago"
              type="lease"
            />
            <ActivityItem
              title="New Property"
              description="Riverside Apartments added to portfolio"
              date="1 week ago"
              type="property"
            />
          </div>
        </CardBody>
        <CardActions>
          <Button fillMode="flat" className="ml-auto"
            startIcon={<SvgIcon icon={arrowRightIcon} />}>
            View All Activity
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  link,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardBody className="p-0">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
              {icon}
            </div>
            <h3 className="text-base font-medium text-slate-600">{title}</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{value}</span>
            <Link href={link}>
              <Button
                startIcon={<SvgIcon icon={arrowRightIcon} />}
                fillMode="flat"
              />
            </Link>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function ActivityItem({
  title,
  description,
  date,
  type,
}: {
  title: string;
  description: string;
  date: string;
  type: "tenant" | "payment" | "maintenance" | "lease" | "property";
}) {
  const getIcon = () => {
    switch (type) {
      case "tenant":
        return <Users size={16} className="text-blue-600" />;
      case "payment":
        return <CreditCard size={16} className="text-green-600" />;
      case "maintenance":
        return <ActivitySquare size={16} className="text-red-600" />;
      case "lease":
        return <Calendar size={16} className="text-yellow-600" />;
      case "property":
        return <Building size={16} className="text-purple-600" />;
      default:
        return <div />;
    }
  };

  return (
    <div className="flex py-3 border-b last:border-0">
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-4">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <div className="text-sm text-slate-500 whitespace-nowrap">{date}</div>
    </div>
  );
}
