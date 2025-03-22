import React from "react"
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from "@progress/kendo-react-layout"

export default function page() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: March 22, 2025</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
          <CardSubtitle>
            This Privacy Policy describes how your personal information is collected, used, and shared when you use our
            Real Estate Management Dashboard.
          </CardSubtitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <section className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
              <p className="mb-4">
                When you use our Real Estate Management Dashboard, we collect several types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> When you create an account, we collect your name, email address,
                  password, and other contact information.
                </li>
                <li>
                  <strong>Property Information:</strong> Details about properties you manage, including addresses,
                  property features, rental rates, and occupancy status.
                </li>
                <li>
                  <strong>Tenant Information:</strong> Information about your tenants, including names, contact details,
                  lease terms, and payment history.
                </li>
                <li>
                  <strong>Payment Information:</strong> Records of payments, including amounts, dates, and payment
                  methods.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use our dashboard, including log data, device
                  information, and analytics.
                </li>
              </ul>
            </section>

            <section className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our Real Estate Management Dashboard</li>
                <li>Process and manage property listings, tenant relationships, and payments</li>
                <li>Communicate with you about your account, properties, and tenants</li>
                <li>Send you updates, security alerts, and support messages</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Prevent fraudulent activity and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">3. Information Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information in the following situations:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service Providers:</strong> We may share your information with third-party vendors who provide
                  services on our behalf, such as hosting, data analysis, payment processing, and customer service.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information if required by law, such as to
                  comply with a subpoena or similar legal process.
                </li>
                <li>
                  <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets,
                  your information may be transferred as part of that transaction.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share your information with third parties when you have given
                  us your consent to do so.
                </li>
              </ul>
            </section>

            <section className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
              <p className="mb-2">
                We implement appropriate security measures to protect your personal information from unauthorized access,
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication procedures</li>
                <li>Secure data storage practices</li>
              </ul>
              <p className="mt-2">
                However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to access the personal information we hold about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </section>

            <section className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">6. Cookies and Tracking Technologies</h2>
              <p className="mb-2">
                We use cookies and similar tracking technologies to track activity on our dashboard and hold certain
                information. Cookies are files with a small amount of data that may include an anonymous unique
                identifier.
              </p>
              <p className="mb-2">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                if you do not accept cookies, you may not be able to use some portions of our dashboard.
              </p>
            </section>

            <section className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">7. Changes to This Privacy Policy</h2>
              <p className="mb-2">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p className="mb-2">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
                are effective when they are posted on this page.
              </p>
            </section>

            <section className="pt-6">
              <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
              <p className="mb-2">If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>By email: privacy@estateluxe.com</li>
                <li>By phone: (555) 123-4567</li>
                <li>By mail: 123 Property Lane, Suite 100, Real Estate City, RE 12345</li>
              </ul>
            </section>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}