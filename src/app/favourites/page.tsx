"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@progress/kendo-react-layout";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { useRouter } from "next/navigation";
import { Bed, Bath } from "lucide-react";

import type { PropertyType } from "@/lib/types";
import Image from "next/image";
import {
  arrowLeftIcon,
  gridIcon,
  heartOutlineIcon,
  homeIcon,
  listUnorderedSquareIcon,
  mapMarkerIcon,
} from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";

export default function UserFavourites() {
  const router = useRouter();
  const [favouriteProperties, setFavouriteProperties] = useState<
    PropertyType[]
  >([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favourites");
    if (storedFavourites) {
      setFavouriteProperties(JSON.parse(storedFavourites));
    }
  }, []);

  const handleViewProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const handleRemoveFavourite = (propertyId: string) => {
    const updatedFavourites = favouriteProperties.filter(
      (p) => p.id !== propertyId,
    );
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    setFavouriteProperties(updatedFavourites);
  };

  const handleSortChange = (e: DropDownListChangeEvent) => {
    setSortBy(e.value);
    console.log("Sort By: ", e.value);

    const sortedProperties = [...favouriteProperties];

    if (e.value.value === "price-low") {
      sortedProperties.sort((a, b) => a.price - b.price);
    } else if (e.value.value === "price-high") {
      sortedProperties.sort((a, b) => b.price - a.price);
      console.log("Sorted Properties: ", sortedProperties);
    } else if (e.value.value === "newest") {
      sortedProperties.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (e.value.value === "bedrooms") {
      sortedProperties.sort((a, b) => b.bedrooms - a.bedrooms);
    }

    setFavouriteProperties(sortedProperties);
  };

  const sortOptions = [
    { text: "Newest First", value: "newest" },
    { text: "Price (Low to High)", value: "price-low" },
    { text: "Price (High to Low)", value: "price-high" },
    { text: "Most Bedrooms", value: "bedrooms" },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between flex-wrap items-center mb-6">
        <h1 className="text-3xl font-bold">Favourite Properties</h1>
        <Button
          onClick={() => router.push("/dashboard")}
          startIcon={<SvgIcon icon={arrowLeftIcon} />}
          fillMode="flat"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <p className="mr-2">Sort by:</p>
          <DropDownList
            data={sortOptions}
            textField="text"
            dataItemKey="value"
            value={sortBy}
            onChange={handleSortChange}
            style={{ width: "200px" }}
          />
        </div>
        <div className="flex space-x-2">
          <ButtonGroup>
            <Button
              startIcon={<SvgIcon icon={gridIcon} />}
              togglable={true}
              selected={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
            />
            <Button
              startIcon={<SvgIcon icon={listUnorderedSquareIcon} />}
              togglable={true}
              selected={viewMode === "list"}
              onClick={() => setViewMode("list")}
            />
          </ButtonGroup>
        </div>
      </div>

      {favouriteProperties.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {favouriteProperties.map((property) => (
            <Card key={property.id} className="shadow-sm">
              {viewMode === "grid" ? (
                <>
                  <div className="relative">
                    <Image
                      width={400}
                      height={192}
                      src={property.image || `/placeholder.svg`}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full shadow-sm w-8 h-8 flex items-center justify-center">
                      <Button
                        fillMode={"flat"}
                        className="rounded-full p-2 shadow-sm"
                        onClick={() => handleRemoveFavourite(property.id)}
                      >
                        <SvgIcon icon={heartOutlineIcon} className="text-red-500" size="large" />
                      </Button>
                    </div>
                  </div>
                  <CardBody>
                    <h3 className="font-bold text-lg mb-1">{property.name}</h3>
                    <p className="text-gray-600 flex items-center mb-2">
                      <SvgIcon icon={mapMarkerIcon} className="mr-1" />{" "}
                      {property.location}
                    </p>
                    <p className="text-xl font-bold text-primary mb-2">
                      ${property.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between text-gray-600 mb-4">
                      <span className="flex items-center">
                        <Bed size={16} className="mr-1" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center">
                        <Bath size={16} className="mr-1" /> {property.bathrooms}
                      </span>
                      <span className="flex items-center">
                        <SvgIcon icon={homeIcon} className="mr-1" />{" "}
                        {property.sqft} sqft
                      </span>
                    </div>
                    <Button
                      onClick={() => handleViewProperty(property.id)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardBody>
                </>
              ) : (
                <div className="flex flex-col md:flex-row">
                  <Image
                    width={200}
                    height={200}
                    src={
                      property.image || `/placeholder.svg?height=150&width=200`
                    }
                    alt={property.name}
                    className="w-full md:w-50 object-cover"
                  />
                  <div className="p-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg mb-1">
                        {property.name}
                      </h3>
                      <Button
                        fillMode="flat"
                        className="p-1"
                        onClick={() => handleRemoveFavourite(property.id)}
                      >
                        <SvgIcon icon={heartOutlineIcon} className="text-red-500" />
                      </Button>
                    </div>
                    <p className="text-gray-600 flex items-center mb-2">
                      <SvgIcon icon={mapMarkerIcon} className="mr-1" />{" "}
                      {property.location}
                    </p>
                    <p className="text-xl font-bold text-primary mb-2">
                      ${property.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between text-gray-600 mb-4">
                      <span className="flex items-center">
                        <Bed size={16} className="mr-1" /> {property.bedrooms}{" "}
                        Beds
                      </span>
                      <span className="flex items-center">
                        <Bath size={16} className="mr-1" /> {property.bathrooms}{" "}
                        Baths
                      </span>
                      <span className="flex items-center">
                        <SvgIcon icon={homeIcon} className="mr-1" />{" "}
                        {property.sqft} sqft
                      </span>
                    </div>
                    <Button onClick={() => handleViewProperty(property.id)}>
                      View Details
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <SvgIcon icon={heartOutlineIcon} size="xxlarge" className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold mb-2">No Favourite Properties</h3>
            <p className="text-gray-600 mb-4">
              You haven&apos;t saved any properties to your favourites yet.
            </p>
            <Button onClick={() => router.push("/search")}>
              Browse Properties
            </Button>
          </CardBody>
        </Card>
      )}
    </main>
  );
}
