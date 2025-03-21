"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardBody } from "@progress/kendo-react-layout"
import { Button } from "@progress/kendo-react-buttons"
import { Form, Field, FormElement } from "@progress/kendo-react-form"
import { Checkbox, Input } from "@progress/kendo-react-inputs"
import { Notification, NotificationGroup } from "@progress/kendo-react-notification"
import { User, Lock, Mail } from "lucide-react"

import { AuthUser, useAuth } from "@/lib/auth-context"
import MetaTitle from "@/components/MetaTitle"
import { Loader } from "@progress/kendo-react-indicators"

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading } = useAuth()
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error"
    message: string
  }>({
    show: false,
    type: "error",
    message: "",
  })

  const handleSubmit = async (values: AuthUser & { confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      setNotification({
        show: true,
        type: "error",
        message: "Passwords do not match. Please try again.",
      })
      return
    }

    const success = await register(values.name, values.email, values.password)

    if (success) {
      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: "Registration successful! Redirecting to dashboard...",
      })

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } else {
      // Show error notification
      setNotification({
        show: true,
        type: "error",
        message: "Email already exists. Please use a different email or login.",
      })
    }

    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification({
        ...notification,
        show: false,
      })
    }, 5000)
  }

  return (
    <MetaTitle title="Register">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
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
            <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
            <p className="mt-2 text-gray-600">Join EstateManager to find your dream property</p>
          </div>

          <Card className="shadow-md">
            <CardBody>
              <Form
                onSubmit={(values) => handleSubmit(values as AuthUser & { confirmPassword: string })}
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                render={(formRenderProps) => (
                  <FormElement>
                    <div className="space-y-4">
                      <Field
                        id="name"
                        name="name"
                        label="Full Name"
                        component={Input}
                        validator={(value) => (!value ? "Name is required" : "")}
                        prefix={<User className="text-gray-400" size={18} />}
                      />

                      <Field
                        id="email"
                        name="email"
                        label="Email Address"
                        component={Input}
                        validator={(value) => {
                          if (!value) return "Email is required"
                          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                            return "Please enter a valid email address"
                          }
                          return ""
                        }}
                        prefix={<Mail className="text-gray-400" size={18} />}
                      />

                      <Field
                        id="password"
                        name="password"
                        label="Password"
                        component={Input}
                        type="password"
                        validator={(value) => {
                          if (!value) return "Password is required"
                          if (value.length < 6) {
                            return "Password must be at least 6 characters"
                          }
                          return ""
                        }}
                        prefix={<Lock className="text-gray-400" size={18} />}
                      />

                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        component={Input}
                        type="password"
                        validator={(value) => {
                          if (!value) return "Please confirm your password"
                          if (value !== formRenderProps.valueGetter("password")) {
                            return "Passwords do not match"
                          }
                          return ""
                        }}
                        prefix={<Lock className="text-gray-400" size={18} />}
                      />

                      <div className="flex items-center">
                        <Checkbox required id="terms" name="terms" />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                          I agree to the{" "}
                          <a href="#" className="text-primary hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        themeColor="primary"
                        disabled={!formRenderProps.allowSubmit || isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <Loader themeColor="light" size="small" type="infinite-spinner" /> Creating account...
                          </>
                        ) : (
                          <>Create Account</>
                        )}
                      </Button>
                    </div>
                  </FormElement>
                )}
              />

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </MetaTitle>
  )
}

