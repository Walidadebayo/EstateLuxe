import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardSubtitle,
} from "@progress/kendo-react-layout";

export default function page() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: March 22, 2025</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
          <CardSubtitle>
            Please read these Terms of Service carefully before using our Real
            Estate Management Dashboard.
          </CardSubtitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <section className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">
                1. Agreement to Terms
              </h2>
              <p className="mb-2">
                By accessing or using our Real Estate Management Dashboard, you
                agree to be bound by these Terms of Service and our Privacy
                Policy. If you disagree with any part of the terms, you may not
                access the service.
              </p>
            </section>

            <section className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">
                2. Description of Service
              </h2>
              <p className="mb-2">
                The Real Estate Management Dashboard is a platform designed to
                help property managers and owners manage their real estate
                portfolios, including properties, tenants, and payments.
              </p>
              <p className="mb-2">
                We reserve the right to modify, suspend, or discontinue the
                service at any time, with or without notice. We shall not be
                liable to you or any third party for any modification,
                suspension, or discontinuation of the service.
              </p>
            </section>

            <section className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
              <p className="mb-2">
                To use certain features of our service, you must register for an
                account. You must provide accurate, current, and complete
                information during the registration process and keep your
                account information up-to-date.
              </p>
              <p className="mb-2">
                You are responsible for safeguarding the password that you use
                to access the service and for any activities or actions under
                your password. We encourage you to use "strong" passwords
                (passwords that use a combination of upper and lower case
                letters, numbers, and symbols) with your account.
              </p>
              <p className="mb-2">
                You agree not to disclose your password to any third party. You
                must notify us immediately upon becoming aware of any breach of
                security or unauthorized use of your account.
              </p>
            </section>

            {/* Continue with remaining sections following the same pattern */}
            {/* Sections 4-11 would follow the same structure with border-b */}

            <section className="pt-6">
              <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
              <p className="mb-2">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>By email: terms@estateluxe.com</li>
                <li>By phone: (555) 123-4567</li>
                <li>
                  By mail:{" "}
                  <p className="text-gray-600">123 Real Estate Avenue</p>
                  <p className="text-gray-600">New York, NY 10001</p>
                </li>
              </ul>
            </section>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
