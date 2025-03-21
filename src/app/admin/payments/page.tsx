"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  GridDataStateChangeEvent,
} from "@progress/kendo-react-grid";
import { CompositeFilterDescriptor, process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { Card, CardBody, CardTitle } from "@progress/kendo-react-layout";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";
import { Plus, Check, AlertTriangle, Clock } from "lucide-react";

import { mockPayments, mockTenants } from "@/lib/mock-data";
import type { PaymentType } from "@/lib/types";
import { SvgIcon } from "@progress/kendo-react-common";
import { pencilIcon } from "@progress/kendo-svg-icons";
import { DateInput } from "@progress/kendo-react-dateinputs";
import { ProtectedRoute } from "@/components/protected-route";
import MetaTitle from "@/components/MetaTitle";

export default function PaymentTracker() {
  const [payments, setPayments] = useState<PaymentType[]>([]);
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
  const [showDialog, setShowDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentType | null>(
    null,
  );
  const [showReminders, setShowReminders] = useState(false);

  // Payment stats
  const [stats, setStats] = useState({
    paid: 0,
    pending: 0,
    overdue: 0,
    total: 0,
  });

  useEffect(() => {
    // In a real app, this would be an API call
    setPayments(mockPayments);

    // Calculate stats
    const paid = mockPayments.filter((p) => p.status === "Paid").length;
    const pending = mockPayments.filter((p) => p.status === "Pending").length;
    const overdue = mockPayments.filter((p) => p.status === "Overdue").length;

    setStats({
      paid,
      pending,
      overdue,
      total: paid + pending + overdue,
    });
  }, []);

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

  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowDialog(true);
  };

  const handleEditPayment = (payment: PaymentType) => {
    setEditingPayment(payment);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleSubmit = (values: PaymentType) => {
    let updatedPayments;

    if (editingPayment) {
      // Update payment
      updatedPayments = payments.map((p) =>
        p.id === editingPayment.id ? { ...values, id: editingPayment.id } : p,
      );
      setPayments(updatedPayments);
    } else {
      // Add new payment
      const newPayment = {
        ...values,
        id: `${payments.length + 1}`,
      };
      updatedPayments = [...payments, newPayment];
      setPayments(updatedPayments);
    }

    setShowDialog(false);

    // Recalculate stats using the updated payments array, not the state which hasn't updated yet
    const paid = updatedPayments.filter((p) => p.status === "Paid").length;
    const pending = updatedPayments.filter(
      (p) => p.status === "Pending",
    ).length;
    const overdue = updatedPayments.filter(
      (p) => p.status === "Overdue",
    ).length;

    setStats({
      paid,
      pending,
      overdue,
      total: paid + pending + overdue,
    });
  };

  const handleSendReminders = () => {
    setShowReminders(true);
  };

  // Process data for the grid
  const processedData = process(payments, dataState);

  // Payment status options
  const paymentStatusOptions = ["Paid", "Pending", "Overdue"];

  // Payment method options
  const paymentMethodOptions = ["Cash", "Credit Card", "Bank Transfer"];

  // Tenant options for dropdown
  const tenantOptions = mockTenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
  }));

  // Chart data
  const chartData = [
    { category: "Paid", value: stats.paid },
    { category: "Pending", value: stats.pending },
    { category: "Overdue", value: stats.overdue },
  ];

  // Overdue payments for reminders
  const overduePayments = payments
    .filter((p) => p.status === "Overdue")
    .map((payment) => {
      const tenant = mockTenants.find((t) => t.id === payment.tenantId);
      return {
        ...payment,
        tenantName: tenant?.name || "Unknown",
        tenantEmail: tenant?.email || "Unknown",
        tenantPhone: tenant?.phone || "Unknown",
      };
    });

  return (
    <MetaTitle title="Payment Tracker">
      <ProtectedRoute requireAdmin>
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Payment Tracker</h1>
            <div className="flex gap-2">
              <Button
                onClick={handleSendReminders}
                startIcon={<AlertTriangle />}
              >
                Send Reminders
              </Button>
              <Button startIcon={<Plus />} onClick={handleAddPayment}>
                Add Payment
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="mr-4 bg-green-100 p-3 rounded-full">
                    <Check className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Paid</p>
                    <p className="text-2xl font-bold">{stats.paid}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="mr-4 bg-yellow-100 p-3 rounded-full">
                    <Clock className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Pending</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="mr-4 bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Overdue</p>
                    <p className="text-2xl font-bold">{stats.overdue}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="mr-4 bg-blue-100 p-3 rounded-full">
                    <div className="text-blue-600 font-bold">$</div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Total Payments</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Payment Chart */}
            <Card className="lg:col-span-1">
              <CardBody>
                <CardTitle className="text-xl font-bold mb-4">
                  Payment Status
                </CardTitle>
                <Chart style={{ height: 300 }}>
                  <ChartSeries>
                    <ChartSeriesItem
                      type="pie"
                      data={chartData}
                      field="value"
                      categoryField="category"
                      labels={{
                        visible: true,
                        content: (e) => `${e.category}: ${e.value}`,
                      }}
                    />
                  </ChartSeries>
                </Chart>
              </CardBody>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardBody>
                <CardTitle className="text-xl font-bold mb-4">
                  Recent Activity
                </CardTitle>
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => {
                    const tenant = mockTenants.find(
                      (t) => t.id === payment.tenantId,
                    );
                    let statusClass = "px-2 py-1 rounded text-xs font-medium";

                    if (payment.status === "Paid") {
                      statusClass += " bg-green-100 text-green-800";
                    } else if (payment.status === "Pending") {
                      statusClass += " bg-yellow-100 text-yellow-800";
                    } else if (payment.status === "Overdue") {
                      statusClass += " bg-red-100 text-red-800";
                    }

                    return (
                      <div
                        key={payment.id}
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">
                            {tenant?.name || "Unknown Tenant"}
                          </p>
                          <p className="text-sm text-foreground">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            ${payment.amount.toLocaleString()}
                          </p>
                          <span className={statusClass}>{payment.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Payments Grid */}
          <Card>
            <CardBody>
              <CardTitle className="text-xl font-bold mb-4">
                All Payments
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
                  field="tenantId"
                  title="Tenant"
                  cells={{
                    data: (props) => {
                      const tenant = mockTenants.find(
                        (t) => t.id === props.dataItem.tenantId,
                      );
                      return <td>{tenant?.name || "Unknown"}</td>;
                    },
                  }}
                />
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
                <GridColumn
                  title="Actions"
                  width="120px"
                  cells={{
                    data: (props) => (
                      <td>
                        <Button
                          onClick={() => handleEditPayment(props.dataItem)}
                          title="Edit"
                          fillMode={"flat"}
                        >
                          <SvgIcon icon={pencilIcon} />
                        </Button>
                      </td>
                    ),
                  }}
                />
              </Grid>
            </CardBody>
          </Card>

          {/* Add/Edit Payment Dialog */}
          {showDialog && (
            <Dialog
              title={editingPayment ? "Edit Payment" : "Add Payment"}
              onClose={handleCloseDialog}
              width={500}
            >
              <Form
                initialValues={
                  editingPayment || {
                    tenantId: "",
                    amount: 0,
                    date: new Date(),
                    status: "Pending",
                    method: "Bank Transfer",
                  }
                }
                onSubmit={(values) => handleSubmit(values as PaymentType)}
                render={(formRenderProps) => (
                  <FormElement>
                    <div className="p-4 grid gap-4">
                      <Field
                        id="tenantId"
                        name="tenantId"
                        label="Tenant"
                        component={DropDownList}
                        data={tenantOptions}
                        textField="name"
                        dataItemKey="id"
                        validator={(value) =>
                          !value ? "Tenant is required" : ""
                        }
                      />

                      <Field
                        id="amount"
                        name="amount"
                        label="Amount"
                        format="c2"
                        component={NumericTextBox}
                        validator={(value) =>
                          value <= 0 ? "Amount must be greater than 0" : ""
                        }
                      />

                      <Field
                        id="date"
                        name="date"
                        label="Payment Date"
                        component={DateInput}
                        format="yyyy-MM-dd"
                        validator={(value) =>
                          !value ? "Date is required" : ""
                        }
                      />
                      {/* <DatePicker /> */}

                      <Field
                        id="method"
                        name="method"
                        label="Payment Method"
                        component={DropDownList}
                        data={paymentMethodOptions}
                        validator={(value) =>
                          !value ? "Payment method is required" : ""
                        }
                      />

                      <Field
                        id="status"
                        name="status"
                        label="Payment Status"
                        component={DropDownList}
                        data={paymentStatusOptions}
                        validator={(value) =>
                          !value ? "Payment status is required" : ""
                        }
                      />
                    </div>
                    <DialogActionsBar>
                      <Button onClick={handleCloseDialog}>Cancel</Button>
                      <Button
                        disabled={!formRenderProps.allowSubmit}
                        onClick={formRenderProps.onSubmit}
                      >
                        {editingPayment ? "Update" : "Add"}
                      </Button>
                    </DialogActionsBar>
                  </FormElement>
                )}
              />
            </Dialog>
          )}

          {/* Payment Reminders Dialog */}
          {showReminders && (
            <Dialog
              title="Send Payment Reminders"
              onClose={() => setShowReminders(false)}
              width={600}
            >
              <div className="p-4">
                <p className="mb-4">
                  The following tenants have overdue payments:
                </p>

                {overduePayments.length > 0 ? (
                  <div className="space-y-4 mb-4">
                    {overduePayments.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold">
                            {payment.tenantName}
                          </h3>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                            Overdue
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-1">
                          <strong>Email:</strong> {payment.tenantEmail}
                        </p>
                        <p className="text-sm text-foreground mb-1">
                          <strong>Phone:</strong> {payment.tenantPhone}
                        </p>
                        <p className="text-sm text-foreground mb-1">
                          <strong>Amount Due:</strong> $
                          {payment.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-foreground">
                          <strong>Due Date:</strong>{" "}
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button>Send Email</Button>
                          <Button>Send SMS</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-foreground">
                    No overdue payments found.
                  </p>
                )}
              </div>
              <DialogActionsBar>
                <Button onClick={() => setShowReminders(false)}>Close</Button>
                {overduePayments.length > 0 && (
                  <Button>Send All Reminders</Button>
                )}
              </DialogActionsBar>
            </Dialog>
          )}
        </main>
      </ProtectedRoute>
    </MetaTitle>
  );
}
