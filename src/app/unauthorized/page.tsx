"use client";

import { useRouter } from "next/navigation";
import { Button } from "@progress/kendo-react-buttons";
import { Card, CardBody } from "@progress/kendo-react-layout";
import { AlertTriangle } from "lucide-react";
import { SvgIcon } from "@progress/kendo-react-common";
import { arrowLeftIcon, homeIcon } from "@progress/kendo-svg-icons";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardBody className="p-8">
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mb-6">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Access Denied
            </h1>
            <p className="text-foreground mb-6">
              You don&apos;t have permission to access this page. This area is
              restricted to administrators only.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.back()}
                fillMode="outline"
                className="flex items-center justify-center"
                startIcon={<SvgIcon icon={arrowLeftIcon} />}
              >
                Go Back
              </Button>
              <Button
                onClick={() => router.push("/")}
                themeColor="primary"
                className="flex items-center justify-center"
                startIcon={<SvgIcon icon={homeIcon} />}
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
