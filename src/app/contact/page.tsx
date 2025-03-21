"use client";

import { useState } from "react";
import { Card, CardBody, CardTitle } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input, TextArea } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { useRouter } from "next/navigation";
import { Mail, Phone, Send, MessageSquare } from "lucide-react";
import { SvgIcon } from "@progress/kendo-react-common";
import { mapMarkerIcon } from "@progress/kendo-svg-icons";
import {
  Map,
  MapLayers,
  MapMarkerLayer,
  MapTileLayer,
  TileUrlTemplateArgs,
} from "@progress/kendo-react-map";
import MetaTitle from "@/components/MetaTitle";

export default function ContactPage() {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const inquiryTypes = [
    "General Inquiry",
    "Property Viewing Request",
    "Rental Application",
    "Property Listing",
    "Technical Support",
    "Other",
  ];

  const handleSubmit = (values: unknown) => {
    console.log("Form submitted:", values);

    setNotification({
      show: true,
      type: "success",
      message:
        "Your message has been sent successfully! We'll get back to you soon.",
    });

    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification({
        ...notification,
        show: false,
      });
    }, 5000);
  };

  return (
    <MetaTitle title="Contact Us">
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
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Button onClick={() => router.push("/dashboard")} fillMode="flat">
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                <CardTitle className="text-xl font-bold mb-6">
                  Send Us a Message
                </CardTitle>

                <Form
                  onSubmit={handleSubmit}
                  render={(formRenderProps) => (
                    <FormElement>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Field
                          id="name"
                          name="name"
                          label="Your Name"
                          component={Input}
                          validator={(value) =>
                            !value ? "Name is required" : ""
                          }
                        />

                        <Field
                          id="email"
                          name="email"
                          label="Email Address"
                          type="email"
                          component={Input}
                          validator={(value) => {
                            if (!value) return "Email is required";
                            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                              return "Please enter a valid email address";
                            }
                            return "";
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Field
                          id="phone"
                          name="phone"
                          label="Phone Number (Optional)"
                          component={Input}
                        />

                        <Field
                          id="inquiryType"
                          name="inquiryType"
                          label="Inquiry Type"
                          component={DropDownList}
                          data={inquiryTypes}
                          validator={(value) =>
                            !value ? "Please select an inquiry type" : ""
                          }
                        />
                      </div>

                      <div className="mb-4">
                        <Field
                          id="subject"
                          name="subject"
                          label="Subject"
                          component={Input}
                          validator={(value) =>
                            !value ? "Subject is required" : ""
                          }
                        />
                      </div>

                      <Field
                        id="message"
                        name="message"
                        label="Message"
                        component={TextArea}
                        rows={6}
                        validator={(value) =>
                          !value ? "Message is required" : ""
                        }
                      />

                      <div className="mt-6">
                        <Button
                          themeColor="primary"
                          type="submit"
                          disabled={!formRenderProps.allowSubmit}
                          startIcon={<Send />}
                        >
                          Send Message
                        </Button>
                      </div>
                    </FormElement>
                  )}
                />
              </CardBody>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardBody>
                <CardTitle className="text-xl font-bold mb-4">
                  Contact Information
                </CardTitle>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Mail className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">info@estatemanagement.com</p>
                      <p className="text-gray-600">
                        support@estatemanagement.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Phone className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">+1 (555) 987-6543</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <SvgIcon
                        icon={mapMarkerIcon}
                        className="text-primary"
                        size="large"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Office Address</h3>
                      <p className="text-gray-600">123 Real Estate Avenue</p>
                      <p className="text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                  <Map
                    center={[40.7128, 74.0060]}
                    zoom={1}
                    style={{ height: "300px" }}
                  >
                    <MapLayers>
                      <MapTileLayer
                        urlTemplate={(e: TileUrlTemplateArgs) =>
                          `https://${e.subdomain}.tile.openstreetmap.org/${e.zoom}/${e.x}/${e.y}.png`
                        }
                        attribution="© OpenStreetMap contributors"
                      />
                      <MapMarkerLayer
                        data={[
                          {
                            latlng: [40.7128, 74.0060],
                            name: "office",
                          },
                        ]}
                        locationField="latlng"
                        titleField="office"
                      />
                    </MapLayers>
                  </Map>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <CardTitle className="text-xl font-bold mb-4">
                  Office Hours
                </CardTitle>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="text-primary" size={18} />
                    <h3 className="font-semibold">Need Immediate Assistance?</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Our AI assistant is available 24/7 to help with your
                    questions.
                  </p>
                  <Button onClick={() => router.push("/ai-assistant")}>
                    Chat with EstateLuxeAI
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </MetaTitle>
  );
}
