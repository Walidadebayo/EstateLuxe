"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardBody,
  TabStripSelectEventArguments,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Checkbox, Input } from "@progress/kendo-react-inputs";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Lock, Mail } from "lucide-react";

import { AuthUser, useAuth, type UserRole } from "@/lib/auth-context";
import { Loader } from "@progress/kendo-react-indicators";
import MetaTitle from "@/components/MetaTitle";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [selected, setSelected] = useState(0);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "error",
    message: "",
  });

  const handleSelect = (e: TabStripSelectEventArguments) => {
    setSelected(e.selected);
  };

  const handleSubmit = async (values: AuthUser) => {
    const role: UserRole = selected === 0 ? "user" : "admin";
    const success = await login(values.email, values.password, role);

    if (success) {
      // Redirect based on role
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      // Show error notification
      setNotification({
        show: true,
        type: "error",
        message: "Invalid email or password. Please try again.",
      });

      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({
          ...notification,
          show: false,
        });
      }, 5000);
    }
  };

  return (
    <MetaTitle title="Login">
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        {/* Notification */}
        <NotificationGroup>
          {notification.show && (
            <Notification
              type={{
                style: notification.type,
                icon: true,
              }}
              closable={true}
              onClose={() => setNotification({ ...notification, show: false })}
            >
              <span>{notification.message}</span>
            </Notification>
          )}
        </NotificationGroup>

        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="mt-2 text-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <Card className="shadow-md">
            <CardBody>
              <TabStrip
                selected={selected}
                onSelect={handleSelect}
                className="mb-6"
              >
                <TabStripTab title="User Login">
                  <div className="py-4">
                    <Form
                      // onSubmit={(values) => handleSubmit(values as AuthUser)}
                      initialValues={{
                        email: "user@example.com",
                        password: "user123",
                      }}
                      render={(formRenderProps) => (
                        <FormElement>
                          <div className="space-y-4">
                            <Field
                              id="email"
                              name="email"
                              label="Email Address"
                              component={Input}
                              type="email"
                              validator={(value) =>
                                !value ? "Email is required" : ""
                              }
                              prefix={
                                <Mail className="text-gray-400" size={18} />
                              }
                            />

                            <Field
                              id="password"
                              name="password"
                              label="Password"
                              component={Input}
                              type="password"
                              validator={(value) =>
                                !value ? "Password is required" : ""
                              }
                              prefix={
                                <Lock className="text-gray-400" size={18} />
                              }
                            />

                            <div className="flex items-center justify-between">
                              <label className="flex items-center">
                                <Checkbox defaultChecked />
                                <span className="ml-2 text-sm text-gray-600">
                                  Remember me
                                </span>
                              </label>
                              <a
                                href="#"
                                className="text-sm text-primary hover:underline"
                              >
                                Forgot password?
                              </a>
                            </div>

                            <Button
                              type="submit"
                              themeColor="primary"
                              disabled={!formRenderProps.valid || isLoading}
                              onClick={() => {
                                const email =
                                  formRenderProps.valueGetter("email");
                                const password =
                                  formRenderProps.valueGetter("password");
                                if (!email || !password) {
                                  setNotification({
                                    show: true,
                                    type: "error",
                                    message: "Please fill in all fields.",
                                  });
                                  setTimeout(() => {
                                    setNotification({
                                      ...notification,
                                      show: false,
                                    });
                                  }, 5000);
                                } else {
                                  handleSubmit({ email, password } as AuthUser);
                                }
                              }}
                              className="w-full"
                            >
                              {isLoading ? (
                                <>
                                  <Loader
                                    size="small"
                                    themeColor="light"
                                    type="infinite-spinner"
                                  />{" "}
                                  Signing in...
                                </>
                              ) : (
                                <>Sign In</>
                              )}
                            </Button>
                          </div>
                        </FormElement>
                      )}
                    />
                  </div>
                </TabStripTab>

                <TabStripTab title="Admin Login">
                  <div className="py-4">
                    <Form
                      // onSubmit={(values) => handleSubmit(values as AuthUser)}
                      initialValues={{
                        email: "admin@example.com",
                        password: "admin123",
                      }}
                      render={(formRenderProps) => (
                        <FormElement>
                          <div className="space-y-4">
                            <Field
                              id="email"
                              name="email"
                              label="Admin Email"
                              component={Input}
                              type="email"
                              validator={(value) =>
                                !value ? "Email is required" : ""
                              }
                              prefix={
                                <Mail className="text-gray-400" size={18} />
                              }
                            />

                            <Field
                              id="password"
                              name="password"
                              label="Password"
                              component={Input}
                              type="password"
                              validator={(value) =>
                                !value ? "Password is required" : ""
                              }
                              prefix={
                                <Lock className="text-gray-400" size={18} />
                              }
                            />

                            <div className="flex items-center justify-between">
                              <label className="flex items-center">
                                <Checkbox defaultChecked />
                                <span className="ml-2 text-sm text-gray-600">
                                  Remember me
                                </span>
                              </label>
                              <a
                                href="#"
                                className="text-sm text-primary hover:underline"
                              >
                                Forgot password?
                              </a>
                            </div>

                            <Button
                              type="submit"
                              themeColor="primary"
                              disabled={!formRenderProps.valid || isLoading}
                              onClick={() => {
                                const email =
                                  formRenderProps.valueGetter("email");
                                const password =
                                  formRenderProps.valueGetter("password");
                                if (!email || !password) {
                                  setNotification({
                                    show: true,
                                    type: "error",
                                    message: "Please fill in all fields.",
                                  });
                                  setTimeout(() => {
                                    setNotification({
                                      ...notification,
                                      show: false,
                                    });
                                  }, 5000);
                                } else {
                                  handleSubmit({ email, password } as AuthUser);
                                }
                              }}
                              className="w-full"
                            >
                              {isLoading ? (
                                <>
                                  <Loader
                                    themeColor="light"
                                    size="small"
                                    type="infinite-spinner"
                                  />{" "}
                                  Signing in...
                                </>
                              ) : (
                                <>Admin Sign In</>
                              )}
                            </Button>
                          </div>
                        </FormElement>
                      )}
                    />
                  </div>
                </TabStripTab>
              </TabStrip>

              <div className="mt-4 text-center">
                <p className="text-sm text-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-primary hover:underline"
                  >
                    Register now
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>

          <div className="dark:bg-secondary p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-foreground mb-2">
              Demo Credentials
            </h3>
            <div className="text-xs text-foreground space-y-1">
              <p>
                <strong>User:</strong> user@example.com / password
              </p>
              <p>
                <strong>Admin:</strong> admin@example.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </MetaTitle>
  );
}
