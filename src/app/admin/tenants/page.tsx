"use client";

import { useState, useEffect, useMemo } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { CompositeFilterDescriptor, process } from "@progress/kendo-data-query";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { DateInput } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { Plus, Edit, Trash2 } from "lucide-react";

import { mockTenants, mockProperties } from "@/lib/mock-data";
import type { TenantType } from "@/lib/types";
import type { GridDataStateChangeEvent } from "@progress/kendo-react-grid";
import { ProtectedRoute } from "@/components/protected-route";
import MetaTitle from "@/components/MetaTitle";

export default function TenantManagement() {
  const [tenants, setTenants] = useState<TenantType[]>([]);

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
  const [editingTenant, setEditingTenant] = useState<TenantType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setTenants(mockTenants);
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

  const handleAddTenant = () => {
    setEditingTenant(null);
    setShowDialog(true);
    setIsDeleting(false);
  };

  const handleEditTenant = (tenant: TenantType) => {
    setEditingTenant(tenant);
    setShowDialog(true);
    setIsDeleting(false);
  };

  const handleDeleteTenant = (tenant: TenantType) => {
    setEditingTenant(tenant);
    setIsDeleting(true);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleSubmit = (values: TenantType) => {
    if (isDeleting) {
      // Delete tenant
      setTenants(tenants.filter((t) => t.id !== editingTenant?.id));
    } else if (editingTenant) {
      // Update tenant
      setTenants(
        tenants.map((t) =>
          t.id === editingTenant.id ? { ...values, id: editingTenant.id } : t,
        ),
      );
    } else {
      // Add new tenant
      const newTenant = {
        ...values,
        id: `${tenants.length + 1}`,
      };
      setTenants([...tenants, newTenant]);
    }

    setShowDialog(false);
  };

  // Process data for the grid - use useMemo to prevent recalculation on every render
  const processedData = useMemo(() => {
    return process(tenants, dataState);
  }, [tenants, dataState]);

  // Payment status options
  const paymentStatusOptions = ["Paid", "Pending", "Overdue"];

  // Property options for dropdown
  const propertyOptions = mockProperties.map((property) => ({
    id: property.id,
    name: property.name,
  }));

  return (
    <MetaTitle title="Tenant Management">
      <ProtectedRoute requireAdmin>
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Tenant Management</h1>
            <Button startIcon={<Plus />} onClick={handleAddTenant}>
              Add Tenant
            </Button>
          </div>

          <Grid
            data={processedData}
            pageable={true}
            sortable={true}
            filterable={true}
            onDataStateChange={handleDataStateChange}
            {...dataState}
          >
            <GridColumn field="name" title="Tenant Name" />
            <GridColumn field="email" title="Email" />
            <GridColumn field="phone" title="Phone" />
            <GridColumn
              field="propertyId"
              title="Property"
              cells={{
                data: (props) => {
                  const property = mockProperties.find(
                    (p) => p.id === props.dataItem.propertyId,
                  );
                  return <td>{property?.name || "Unknown"}</td>;
                },
              }}
            />
            <GridColumn
              field="leaseStart"
              title="Lease Start"
              cells={{
                data: (props) => (
                  <td>
                    {new Date(props.dataItem.leaseStart).toLocaleDateString()}
                  </td>
                ),
              }}
            />
            <GridColumn
              field="leaseEnd"
              title="Lease End"
              cells={{
                data: (props) => (
                  <td>
                    {new Date(props.dataItem.leaseEnd).toLocaleDateString()}
                  </td>
                ),
              }}
            />
            <GridColumn
              field="rentAmount"
              title="Rent"
              cell={(props) => (
                <td>${props.dataItem.rentAmount.toLocaleString()}</td>
              )}
            />
            <GridColumn
              field="paymentStatus"
              title="Status"
              cells={{
                data: (props) => {
                  const status = props.dataItem.paymentStatus;
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
              width="180px"
              cells={{
                data: (props) => (
                  <td>
                    <ButtonGroup>
                      <Button
                        startIcon={<Edit />}
                        onClick={() => handleEditTenant(props.dataItem)}
                        title="Edit"
                        fillMode={"flat"}
                      />
                      <Button
                        startIcon={<Trash2 />}
                        onClick={() => handleDeleteTenant(props.dataItem)}
                        title="Delete"
                        fillMode={"flat"}
                      />
                    </ButtonGroup>
                  </td>
                ),
              }}
            />
          </Grid>

          {/* Add/Edit/Delete Dialog */}
          {showDialog && (
            <Dialog
              title={
                isDeleting
                  ? "Delete Tenant"
                  : editingTenant
                    ? "Edit Tenant"
                    : "Add Tenant"
              }
              onClose={handleCloseDialog}
              width={500}
            >
              {isDeleting ? (
                <div className="p-4">
                  <p className="mb-4">
                    Are you sure you want to delete this tenant?
                  </p>
                  <p className="font-semibold">{editingTenant?.name}</p>
                </div>
              ) : (
                <Form
                  initialValues={
                    editingTenant || {
                      name: "",
                      email: "",
                      phone: "",
                      propertyId: "",
                      leaseStart: new Date(),
                      leaseEnd: new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1),
                      ),
                      rentAmount: 0,
                      paymentStatus: "Pending",
                    }
                  }
                  onSubmit={(values) => handleSubmit(values as TenantType)}
                  render={(formRenderProps) => (
                    <FormElement>
                      <div className="p-4 grid gap-4">
                        <Field
                          id="name"
                          name="name"
                          label="Tenant Name"
                          component={Input}
                          validator={(value) =>
                            !value ? "Name is required" : ""
                          }
                        />

                        <Field
                          id="email"
                          name="email"
                          label="Email"
                          type="email"
                          component={Input}
                          validator={(value) =>
                            !value ? "Email is required" : ""
                          }
                        />

                        <Field
                          id="phone"
                          name="phone"
                          label="Phone"
                          component={Input}
                          validator={(value) =>
                            !value ? "Phone is required" : ""
                          }
                        />

                        <Field
                          id="propertyId"
                          name="propertyId"
                          label="Property"
                          component={DropDownList}
                          data={propertyOptions}
                          textField="name"
                          dataItemKey="id"
                          validator={(value) =>
                            !value ? "Property is required" : ""
                          }
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Field
                            id="leaseStart"
                            name="leaseStart"
                            label="Lease Start"
                            component={DateInput}
                            format="yyyy-MM-dd"
                            validator={(value) =>
                              !value ? "Lease start date is required" : ""
                            }
                            suppressHydrationWarning
                          />

                          <Field
                            id="leaseEnd"
                            name="leaseEnd"
                            label="Lease End"
                            component={DateInput}
                            format="yyyy-MM-dd"
                            validator={(value) =>
                              !value ? "Lease end date is required" : ""
                            }
                            suppressHydrationWarning
                          />
                        </div>

                        <Field
                          id="rentAmount"
                          name="rentAmount"
                          label="Rent Amount"
                          format="c2"
                          component={NumericTextBox}
                          validator={(value) =>
                            value <= 0
                              ? "Rent amount must be greater than 0"
                              : ""
                          }
                        />

                        <Field
                          id="paymentStatus"
                          name="paymentStatus"
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
                        {isDeleting ? (
                          <Button
                            disabled={!formRenderProps.allowSubmit}
                            onClick={formRenderProps.onSubmit}
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button
                            disabled={!formRenderProps.allowSubmit}
                            onClick={formRenderProps.onSubmit}
                          >
                            {editingTenant ? "Update" : "Add"}
                          </Button>
                        )}
                      </DialogActionsBar>
                    </FormElement>
                  )}
                />
              )}
              {isDeleting && (
                <DialogActionsBar>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button themeColor="primary" onClick={() => handleSubmit({} as TenantType)}>
                    Delete
                  </Button>
                </DialogActionsBar>
              )}
            </Dialog>
          )}
        </main>
      </ProtectedRoute>
    </MetaTitle>
  );
}
