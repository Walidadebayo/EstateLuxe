"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  type GridDataStateChangeEvent,
  type GridSelectionChangeEvent,
} from "@progress/kendo-react-grid";
import { CompositeFilterDescriptor, process } from "@progress/kendo-data-query";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input, NumericTextBox, TextArea } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Upload } from "@progress/kendo-react-upload";
import { Card, CardBody } from "@progress/kendo-react-layout";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Plus, Edit, Trash2, Image, Save } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";

import { mockProperties } from "@/lib/mock-data";
import type { PropertyType } from "@/lib/types";
import { SvgIcon } from "@progress/kendo-react-common";
import { arrowLeftIcon, xIcon } from "@progress/kendo-svg-icons";

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyType[]>([]);
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

  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(
    null,
  );
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "warning";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  // Property types for dropdown
  const propertyTypes = ["House", "Apartment", "Condo", "Townhouse"];
  const statusOptions = ["For Sale", "For Rent"];

  useEffect(() => {
    // In a real app, this would be an API call
    setProperties(mockProperties);
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

  const handleSelectionChange = (e: GridSelectionChangeEvent) => {
    setSelectedProperty(e.dataItem || null);
  };

  const handleAddProperty = () => {
    setDialogAction("add");
    setSelectedProperty(null);
    setShowDialog(true);
  };

  const handleEditProperty = (property: PropertyType) => {
    setDialogAction("edit");
    setSelectedProperty(property);
    setShowDialog(true);
  };

  const handleDeleteProperty = (property: PropertyType) => {
    setDialogAction("delete");
    setSelectedProperty(property);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleSubmit = (values: PropertyType) => {
    if (dialogAction === "delete") {
      // Delete property
      setProperties(properties.filter((p) => p.id !== selectedProperty?.id));
      showNotification("success", "Property deleted successfully");
    } else if (dialogAction === "edit" && selectedProperty) {
      // Update property
      setProperties(
        properties.map((p) =>
          p.id === selectedProperty.id
            ? {
                ...values,
                id: selectedProperty.id,
                features: values.features
                  ? (values.features as unknown as string)
                      .split(",")
                      .map((f: string) => f.trim())
                  : [],
              }
            : p,
        ),
      );
      showNotification("success", "Property updated successfully");
    } else {
      // Add new property
      const newProperty = {
        ...values,
        id: `${properties.length + 1}`,
        features: values.features
          ? (values.features as unknown as string)
              .split(",")
              .map((f: string) => f.trim())
          : [],
        latitude: values.latitude || 0,
        longitude: values.longitude || 0,
      };
      setProperties([...properties, newProperty]);
      showNotification("success", "Property added successfully");
    }

    setShowDialog(false);
  };

  const showNotification = (
    type: "success" | "error" | "warning",
    message: string,
  ) => {
    setNotification({
      show: true,
      type,
      message,
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({
        ...notification,
        show: false,
      });
    }, 3000);
  };

  // Process data for the grid
  const processedData = process(properties, dataState);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Notification */}
      <NotificationGroup>
        {notification.show && (
          <Notification
            type={{
              style: notification.type,
              icon: notification.type === "success" ? true : false,
            }}
            closable={true}
            onClose={() => setNotification({ ...notification, show: false })}
          >
            <span>{notification.message}</span>
          </Notification>
        )}
      </NotificationGroup>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/admin/dashboard")}
            fillMode="flat"
            startIcon={<SvgIcon icon={arrowLeftIcon} />}
          >
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Property Management</h1>
        </div>
        <Button
          themeColor={"primary"}
          startIcon={<Plus />}
          onClick={handleAddProperty}
        >
          Add Property
        </Button>
      </div>

      <Card>
        <CardBody>
          <Grid
            data={processedData}
            pageable={true}
            sortable={true}
            filterable={true}
            onDataStateChange={handleDataStateChange}
            onSelectionChange={handleSelectionChange}
            {...dataState}
          >
            <GridColumn field="id" title="ID" width="70px" />
            <GridColumn
              field="image"
              title="Image"
              width="100px"
              cell={(props) => (
                <td>
                  {props.dataItem.image ? (
                    <NextImage
                      width={64}
                      height={48}
                      src={props.dataItem.image || "/placeholder.svg"}
                      alt={props.dataItem.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                      {
                        //eslint-disable-next-line jsx-a11y/alt-text
                        <Image size={20} className="text-gray-400" />
                      }
                    </div>
                  )}
                </td>
              )}
            />
            <GridColumn field="name" title="Property Name" />
            <GridColumn field="location" title="Location" />
            <GridColumn
              field="price"
              title="Price"
              cell={(props) => (
                <td>
                  $
                  {props.dataItem.price
                    ? props.dataItem.price.toLocaleString()
                    : "0"}
                </td>
              )}
            />
            <GridColumn field="bedrooms" title="Beds" width="80px" />
            <GridColumn field="bathrooms" title="Baths" width="80px" />
            <GridColumn field="sqft" title="Sq Ft" width="100px" />
            <GridColumn field="type" title="Type" width="120px" />
            <GridColumn field="status" title="Status" width="120px" />
            <GridColumn
              title="Actions"
              width="160px"
              cell={(props) => (
                <td>
                  <ButtonGroup>
                    <Button
                      startIcon={<Edit />}
                      title="Edit"
                      fillMode="flat"
                      onClick={() => handleEditProperty(props.dataItem)}
                    />
                    <Button
                      startIcon={<Trash2 />}
                      title="Delete"
                      fillMode="flat"
                      onClick={() => handleDeleteProperty(props.dataItem)}
                    />
                  </ButtonGroup>
                </td>
              )}
            />
          </Grid>
        </CardBody>
      </Card>

      {/* Add/Edit/Delete Dialog */}
      {showDialog && (
        <Dialog
          title={
            dialogAction === "add"
              ? "Add Property"
              : dialogAction === "edit"
                ? "Edit Property"
                : "Delete Property"
          }
          onClose={handleCloseDialog}
          width={dialogAction === "delete" ? 400 : 800}
        >
          {dialogAction === "delete" ? (
            <div className="p-4">
              <p className="mb-4">
                Are you sure you want to delete this property?
              </p>
              <p className="font-semibold">{selectedProperty?.name}</p>
              <p className="text-foreground">{selectedProperty?.location}</p>
            </div>
          ) : (
            <Form
              initialValues={
                selectedProperty || {
                  name: "",
                  location: "",
                  price: 0,
                  bedrooms: 0,
                  bathrooms: 0,
                  sqft: 0,
                  type: "House",
                  status: "For Sale",
                  description: "",
                  image: "",
                  features: [""],
                  latitude: 0,
                  longitude: 0,
                }
              }
              onSubmit={(value) => handleSubmit(value as PropertyType)}
              render={(fieldRenderProps) => (
                <FormElement>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Field
                        id="name"
                        name="name"
                        label="Property Name"
                        component={Input}
                        validator={(value) =>
                          !value ? "Name is required" : ""
                        }
                      />
                    </div>

                    <Field
                      id="location"
                      name="location"
                      label="Location"
                      component={Input}
                      validator={(value) =>
                        !value ? "Location is required" : ""
                      }
                    />

                    <Field
                      id="price"
                      name="price"
                      label="Price"
                      format="c0"
                      component={NumericTextBox}
                      validator={(value) =>
                        value <= 0 ? "Price must be greater than 0" : ""
                      }
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <Field
                        id="bedrooms"
                        name="bedrooms"
                        label="Bedrooms"
                        component={NumericTextBox}
                        validator={(value) =>
                          value < 0 ? "Bedrooms cannot be negative" : ""
                        }
                      />

                      <Field
                        id="bathrooms"
                        name="bathrooms"
                        label="Bathrooms"
                        component={NumericTextBox}
                        validator={(value) =>
                          value < 0 ? "Bathrooms cannot be negative" : ""
                        }
                      />

                      <Field
                        id="sqft"
                        name="sqft"
                        label="Square Feet"
                        component={NumericTextBox}
                        validator={(value) =>
                          value <= 0 ? "Square feet must be greater than 0" : ""
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        id="type"
                        name="type"
                        label="Property Type"
                        component={DropDownList}
                        data={propertyTypes}
                        validator={(value) =>
                          !value ? "Property type is required" : ""
                        }
                      />

                      <Field
                        id="status"
                        name="status"
                        label="Status"
                        component={DropDownList}
                        data={statusOptions}
                        validator={(value) =>
                          !value ? "Status is required" : ""
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Field
                        id="description"
                        name="description"
                        label="Description"
                        component={TextArea}
                        rows={4}
                        validator={(value) =>
                          !value ? "Description is required" : ""
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Field
                        id="features"
                        name="features"
                        label="Features (comma separated)"
                        component={Input}
                        validator={(value) =>
                          !value ? "At least one feature is required" : ""
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        id="latitude"
                        name="latitude"
                        label="Latitude"
                        component={NumericTextBox}
                        format="n6"
                      />

                      <Field
                        id="longitude"
                        name="longitude"
                        label="Longitude"
                        component={NumericTextBox}
                        format="n6"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Field
                        id="image"
                        name="image"
                        label="Image URL"
                        component={Input}
                        validator={(value) =>
                          !value ? "Image URL is required" : ""
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Upload Image
                      </label>
                      <Upload
                        autoUpload={false}
                        multiple={false}
                        restrictions={{
                          allowedExtensions: [".jpg", ".jpeg", ".png"],
                        }}
                        saveUrl="https://demos.telerik.com/kendo-ui/service-v4/upload/save"
                        withCredentials={false}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Note: In this demo, images are not actually uploaded.
                        Use the Image URL field instead.
                      </p>
                    </div>
                  </div>
                  <DialogActionsBar>
                    <Button
                      onClick={handleCloseDialog}
                      startIcon={<SvgIcon icon={xIcon} />}
                    >
                      Cancel
                    </Button>
                    <Button
                      themeColor={"primary"}
                      startIcon={<Save />}
                      disabled={!fieldRenderProps.allowSubmit}
                      onClick={fieldRenderProps.onSubmit}
                    >
                      {dialogAction === "add" ? "Add Property" : "Save Changes"}
                    </Button>
                  </DialogActionsBar>
                </FormElement>
              )}
            />
          )}
          {dialogAction === "delete" && (
            <DialogActionsBar>
              <Button
                onClick={handleCloseDialog}
                startIcon={<SvgIcon icon={xIcon} />}
              >
                Cancel
              </Button>
              <Button
                themeColor={"primary"}
                onClick={() => handleSubmit({} as PropertyType)}
                startIcon={<Trash2 />}
              >
                Delete
              </Button>
            </DialogActionsBar>
          )}
        </Dialog>
      )}
    </main>
  );
}
