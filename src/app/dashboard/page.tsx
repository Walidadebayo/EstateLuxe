"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";
import { useRouter } from "next/navigation";
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Heart,
  MessageSquare,
  Settings,
  Calendar,
  CreditCard,
} from "lucide-react";

import { mockPayments } from "@/lib/mock-data";
import type { PropertyType, PaymentType } from "@/lib/types";
import Image from "next/image";
import { SvgIcon } from "@progress/kendo-react-common";
import { bellIcon, heartIcon } from "@progress/kendo-svg-icons";
import {
  Grid,
  GridColumn,
  GridDataStateChangeEvent,
} from "@progress/kendo-react-grid";
import { CompositeFilterDescriptor, process } from "@progress/kendo-data-query";

export default function UserDashboard() {
  const router = useRouter();
  const [favouriteProperties, setFavouriteProperties] = useState<
    PropertyType[]
  >([]);
  const [recentPayments, setRecentPayments] = useState<PaymentType[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<
    {
      id: number;
      dueDate: Date;
      amount: number;
      type: string;
      property: string;
    }[]
  >([]);
  const [viewingStats, setViewingStats] = useState<
    {
      month: string;
      viewings: number;
    }[]
  >([]);
  const [dataState, setDataState] = useState<{
    skip: number;
    take: number;
    sort: { field: string; dir?: "asc" | "desc" | undefined }[];
    filter:
      | {
          logic: "and" | "or";
          filters: Array<{
            field: string;
            operator: string;
            value: string | number | boolean;
          }>;
        }
      | CompositeFilterDescriptor;
  }>({
    skip: 0,
    take: 10,
    sort: [{ field: "price", dir: "asc" }],
    filter: { logic: "and", filters: [] },
  });

  const processedData = process(recentPayments, dataState);

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favourites");
    if (storedFavourites) {
      setFavouriteProperties(JSON.parse(storedFavourites));
    }

    setRecentPayments(mockPayments.slice(0, 3));

    // Generate upcoming payments
    const upcoming = [
      {
        id: 1,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        amount: 1200,
        type: "Rent",
        property: "Modern Downtown Apartment",
      },
      {
        id: 2,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 12)),
        amount: 150,
        type: "Utilities",
        property: "Modern Downtown Apartment",
      },
      {
        id: 3,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
        amount: 50,
        type: "Internet",
        property: "Modern Downtown Apartment",
      },
    ];
    setUpcomingPayments(upcoming);

    // Generate viewing stats
    const stats = [
      { month: "Jan", viewings: 5 },
      { month: "Feb", viewings: 8 },
      { month: "Mar", viewings: 12 },
      { month: "Apr", viewings: 7 },
      { month: "May", viewings: 15 },
      { month: "Jun", viewings: 10 },
      { month: "Jul", viewings: 9 },
      { month: "Aug", viewings: 11 },
      { month: "Sep", viewings: 6 },
      { month: "Oct", viewings: 14 },
      { month: "Nov", viewings: 13 },
      { month: "Dec", viewings: 10 },
    ];
    setViewingStats(stats);
  }, []);

  const handleViewProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const handleDataStateChange = (e: GridDataStateChangeEvent) => {
    setDataState((prevState) => ({
      ...prevState,
      ...e.dataState,
      skip: e.dataState.skip ?? prevState.skip,
      take: e.dataState.take ?? prevState.take,
      sort: e.dataState.sort ?? prevState.sort,
      filter: e.dataState.filter ?? prevState.filter,
    }));
  };

  const handleRemoveFavourite = (propertyId: string) => {
    setFavouriteProperties(
      favouriteProperties.filter((p) => p.id !== propertyId),
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <p className="text-gray-600">Welcome back, John Doe</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button fillMode="flat" startIcon={<SvgIcon icon={bellIcon} size="xlarge" />}>
            Notifications
          </Button>
          <Button fillMode="flat" startIcon={<MessageSquare />}>
            Messages
          </Button>
          <Button fillMode="flat" startIcon={<Settings />}>
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center">
              <div className="mr-4 bg-primary/10 p-3 rounded-full">
                <Heart className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Saved Properties</p>
                <p className="text-2xl font-bold">
                  {favouriteProperties.length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center">
              <div className="mr-4 bg-green-100 p-3 rounded-full">
                <Calendar className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Viewings</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center">
              <div className="mr-4 bg-yellow-100 p-3 rounded-full">
                <CreditCard className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold">{upcomingPayments.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center">
              <div className="mr-4 bg-blue-100 p-3 rounded-full">
                <MessageSquare className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Messages</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Favourite Properties */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardBody>
              <CardTitle className="text-xl font-bold mb-4">
                Favourite Properties
              </CardTitle>
              <div className="space-y-4">
                {favouriteProperties.length > 0 ? (
                  favouriteProperties.map((property) => (
                    <div
                      key={property.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <Image
                          width={200}
                          height={200}
                          src={property.image || `/placeholder.svg`}
                          alt={property.name}
                          className="w-full md:w-50 object-cover"
                        />
                        <div className="p-4 flex-1">
                          <h3 className="font-bold text-lg mb-1">
                            {property.name}
                          </h3>
                          <p className="text-gray-600 flex items-center mb-2">
                            <MapPin size={16} className="mr-1" />{" "}
                            {property.location}
                          </p>
                          <p className="text-xl font-bold text-primary mb-2">
                            ${property.price.toLocaleString()}
                          </p>
                          <div className="flex justify-between text-gray-600 mb-4">
                            <span className="flex items-center">
                              <Bed size={16} className="mr-1" />{" "}
                              {property.bedrooms} Beds
                            </span>
                            <span className="flex items-center">
                              <Bath size={16} className="mr-1" />{" "}
                              {property.bathrooms} Baths
                            </span>
                            <span className="flex items-center">
                              <Home size={16} className="mr-1" />{" "}
                              {property.sqft} sqft
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleViewProperty(property.id)}
                            >
                              View Details
                            </Button>
                            <Button
                              fillMode="flat"
                              startIcon={<SvgIcon icon={heartIcon} />}
                              onClick={() => handleRemoveFavourite(property.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>You haven&apos;t saved any properties yet.</p>
                    <Button className="mt-4" themeColor="primary" onClick={() => router.push("/")}>
                      Browse Properties
                    </Button>
                  </div>
                )}
              </div>
              {favouriteProperties.length > 0 && (
                <div className="mt-4 text-center">
                  <Button
                    fillMode="flat"
                    onClick={() => router.push("/favourites")}
                  >
                    View All Favourites
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
          {/* Payments Grid */}
          <Card>
            <CardBody>
              <CardTitle className="text-xl font-bold mb-4">
                Recent Payments
              </CardTitle>
              <Grid
                data={processedData}
                pageable={true}
                sortable={true}
                filterable={true}
                onDataStateChange={handleDataStateChange}
                {...dataState}
              >
                <GridColumn
                  field="date"
                  title="Date"
                  cells={{
                    data: (props) => (
                      <td>
                        {new Date(props.dataItem.date).toLocaleDateString()}
                      </td>
                    ),
                  }}
                />
                <GridColumn
                  field="amount"
                  title="Amount"
                  cells={{
                    data: (props) => (
                      <td>${props.dataItem.amount.toLocaleString()}</td>
                    ),
                  }}
                />
                <GridColumn field="method" title="Method" />
                <GridColumn
                  field="status"
                  title="Status"
                  cells={{
                    data: (props) => {
                      const status = props.dataItem.status;
                      let statusClass = "px-2 py-1 rounded text-xs font-medium";

                      if (status === "Paid") {
                        statusClass += " bg-green-100 text-green-800";
                      } else if (status === "Pending") {
                        statusClass += " bg-yellow-100 text-yellow-800";
                      } else if (status === "Overdue") {
                        statusClass += " bg-red-100 text-red-800";
                      }

                      return (
                        <td>
                          <span className={statusClass}>{status}</span>
                        </td>
                      );
                    },
                  }}
                />
              </Grid>
            </CardBody>
          </Card>
        </div>

        {/* Upcoming Payments */}
        <div>
          <Card className="mb-8">
            <CardBody>
              <CardTitle className="text-xl font-bold mb-4">
                Upcoming Payments
              </CardTitle>
              <div className="space-y-3">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <p className="font-semibold">{payment.type}</p>
                      <p className="font-bold">${payment.amount}</p>
                    </div>
                    <p className="text-sm text-gray-600">{payment.property}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        Due: {payment.dueDate.toLocaleDateString()}
                      </p>
                      <Button size="small">Pay Now</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button themeColor="primary" onClick={() => {}}>
                  View All Payments
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Property Viewings Chart */}
          <Card>
            <CardBody>
              <CardTitle className="text-xl font-bold mb-4">
                Property Viewings
              </CardTitle>
              <Chart style={{ height: 250 }}>
                <ChartCategoryAxis>
                  <ChartCategoryAxisItem
                    categories={viewingStats.map((s) => s.month)}
                  />
                </ChartCategoryAxis>
                <ChartSeries>
                  <ChartSeriesItem
                    type="column"
                    data={viewingStats.map((s) => s.viewings)}
                    color="#0070f3"
                  />
                </ChartSeries>
              </Chart>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
