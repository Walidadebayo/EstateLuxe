"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { useRouter } from "next/navigation";
import { Bed, Bath, MapPin } from "lucide-react";

import type { PropertyType } from "@/lib/types";
import Image from "next/image";

interface PropertyRecommendationsProps {
  currentProperty: PropertyType;
  properties: PropertyType[];
}

export function PropertyRecommendations({
  currentProperty,
  properties,
}: PropertyRecommendationsProps) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<PropertyType[]>([]);

  useEffect(() => {
    // Skip recalculation if we already have recommendations and nothing has changed
    if (
      recommendations.length > 0 &&
      recommendations[0].id !== currentProperty.id &&
      properties.length === recommendations.length + 1
    ) {
      return;
    }

    // In a real app, this would be an AI API call
    // For now, we'll simulate AI recommendations with a simple algorithm

    // Filter out the current property
    const otherProperties = properties.filter(
      (p) => p.id !== currentProperty.id,
    );

    // Simple recommendation algorithm based on:
    // 1. Same property type
    // 2. Similar price range (±20%)
    // 3. Similar location
    // 4. Similar number of bedrooms

    const similarProperties = otherProperties.map((property) => {
      let score = 0;

      // Same property type
      if (property.type === currentProperty.type) {
        score += 3;
      }

      // Similar price range (±20%)
      const minPrice = currentProperty.price ? currentProperty.price * 0.8 : 0;
      const maxPrice = currentProperty.price ? currentProperty.price * 1.2 : 0;
      if (
        property.price &&
        property.price >= minPrice &&
        property.price <= maxPrice
      ) {
        score += 2;
      }

      // Similar location (simple string match for demo)
      if (
        property.location.split(",")[1] ===
        currentProperty.location.split(",")[1]
      ) {
        score += 2;
      }

      // Similar number of bedrooms (±1)
      if (Math.abs(property.bedrooms - currentProperty.bedrooms) <= 1) {
        score += 1;
      }

      return { ...property, score };
    });

    // Sort by score and take top 3
    const topRecommendations = similarProperties
      .sort(
        (a, b) =>
          (b as PropertyType & { score: number }).score -
          (a as PropertyType & { score: number }).score,
      )
      .slice(0, 3)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ score, ...property }) => property as PropertyType);

    setRecommendations(topRecommendations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProperty, properties]);

  const handleViewProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  return (
    <Card>
      <CardBody>
        <CardTitle className="text-xl font-bold mb-4">
          AI Recommended Properties
        </CardTitle>

        <div className="space-y-4">
          {recommendations.map((property) => (
            <div
              key={property.id}
              className="border rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                <Image
                  width={96}
                  height={80}
                  src={property.image || `/placeholder.svg?height=80&width=120`}
                  alt={property.name}
                  className="w-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {property.name}
                  </h3>
                  <p className="text-xs text-foreground flex items-center mb-1">
                    <MapPin size={12} className="mr-1" /> {property.location}
                  </p>
                  <div className="flex justify-between text-xs text-foreground">
                    <span className="flex items-center">
                      <Bed size={12} className="mr-1" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center">
                      <Bath size={12} className="mr-1" /> {property.bathrooms}
                    </span>
                    <span className="font-semibold">
                      ${property.price ? property.price.toLocaleString() : "0"}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="small"
                className="w-full mt-2"
                onClick={() => handleViewProperty(property.id)}
              >
                View Property
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-500 italic">
          Recommendations based on property type, price range, location, and
          features
        </div>
      </CardBody>
    </Card>
  );
}
