"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardBody } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import {
  Input,
  InputChangeEvent,
  RangeSliderChangeEvent,
} from "@progress/kendo-react-inputs";
import { RangeSlider } from "@progress/kendo-react-inputs";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bed,
  Bath,
  Search,
} from "lucide-react";

import { mockProperties } from "@/lib/mock-data";
import Image from "next/image";
import { SvgIcon } from "@progress/kendo-react-common";
import {
  filterIcon,
  gridIcon,
  heartOutlineIcon,
  homeIcon,
  listUnorderedSquareIcon,
  mapMarkerIcon,
  searchIcon,
} from "@progress/kendo-svg-icons";
import MetaTitle from "@/components/MetaTitle";

export default function PropertySearch() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [priceRange, setPriceRange] = useState<{ start: number; end: number }>({
    start: 0,
    end: 2000000,
  });
  const [bedroomsFilter, setBedroomsFilter] = useState<string>("Any");
  const [bathroomsFilter, setBathroomsFilter] = useState<string>("Any");
  const [propertyType, setPropertyType] = useState<string>("Any");
  const [showFilters, setShowFilters] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);

  // Property types for filter
  const propertyTypes = ["Any", "House", "Apartment", "Condo", "Townhouse"];
  const bedroomsOptions = ["Any", "1+", "2+", "3+", "4+", "5+"];
  const bathroomsOptions = ["Any", "1+", "2+", "3+", "4+"];

  useEffect(() => {
    const storedFavourites = JSON.parse(
      localStorage.getItem("favourites") || "[]"
    );
    const propertyIds = storedFavourites.map(
      (property: { id: string }) => property.id
    );
    setFavourites(propertyIds);
  }, []);

  const handleSearchChange = (e: InputChangeEvent) => {
    setSearchQuery(e.value);
  };

  const handlePriceRangeChange = (e: RangeSliderChangeEvent) => {
    setPriceRange(e.value);
  };

  const handleBedroomsChange = (e: DropDownListChangeEvent) => {
    setBedroomsFilter(e.value);
  };

  const handleBathroomsChange = (e: DropDownListChangeEvent) => {
    setBathroomsFilter(e.value);
  };

  const handlePropertyTypeChange = (e: DropDownListChangeEvent) => {
    setPropertyType(e.value);
  };

  const handleViewProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const handleToggleFavourite = (propertyId: string) => {
    if (favourites.includes(propertyId)) {
      const updatedFavourites = favourites.filter((id) => id !== propertyId);
      setFavourites(updatedFavourites);
      const storedFavourites = JSON.parse(
        localStorage.getItem("favourites") || "[]"
      );
      const updatedStoredFavourites = storedFavourites.filter(
        (property: { id: string }) => property.id !== propertyId
      );
      localStorage.setItem(
        "favourites",
        JSON.stringify(updatedStoredFavourites)
      );
    } else {
      const updatedFavourites = [...favourites, propertyId];
      setFavourites(updatedFavourites);
      const storedFavourites = JSON.parse(
        localStorage.getItem("favourites") || "[]"
      );
      const propertyToAdd = mockProperties.find(
        (property) => property.id === propertyId
      );

      if (propertyToAdd) {
        const updatedStoredFavourites = [...storedFavourites, propertyToAdd];
        localStorage.setItem(
          "favourites",
          JSON.stringify(updatedStoredFavourites)
        );
      }
    }
  };

  // Filter properties based on user selections
  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      // Filter by search query
      if (
        searchQuery &&
        !property.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.location.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filter by price range
      if (
        property.price < priceRange.start ||
        property.price > priceRange.end
      ) {
        return false;
      }

      // Filter by bedrooms
      if (bedroomsFilter !== "Any") {
        const minBedrooms = Number.parseInt(bedroomsFilter.replace("+", ""));
        if (property.bedrooms < minBedrooms) {
          return false;
        }
      }

      // Filter by bathrooms
      if (bathroomsFilter !== "Any") {
        const minBathrooms = Number.parseInt(bathroomsFilter.replace("+", ""));
        if (property.bathrooms < minBathrooms) {
          return false;
        }
      }

      // Filter by property type
      if (propertyType !== "Any" && property.type !== propertyType) {
        return false;
      }

      return true;
    });
  }, [searchQuery, priceRange, bedroomsFilter, bathroomsFilter, propertyType]);

  return (
    <MetaTitle title="Property Search">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 flex-wrap">
          <h1 className="text-3xl font-bold">Property Search</h1>
          <Button onClick={() => router.push("/dashboard")} fillMode="flat">
            Back to Dashboard
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardBody className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by location, property name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full"
                />
              </div>
              <Button
                themeColor="primary"
                startIcon={<SvgIcon icon={searchIcon} />}
              >
                Search
              </Button>
              <Button
                startIcon={<SvgIcon icon={filterIcon} />}
                onClick={() => setShowFilters(!showFilters)}
                togglable={true}
                selected={showFilters}
              >
                Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <RangeSlider
                    min={0}
                    max={2000000}
                    step={10000}
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm mt-1">
                    <span>${priceRange.start.toLocaleString()}</span>
                    <span>${priceRange.end.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bedrooms
                  </label>
                  <DropDownList
                    data={bedroomsOptions}
                    value={bedroomsFilter}
                    onChange={handleBedroomsChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bathrooms
                  </label>
                  <DropDownList
                    data={bathroomsOptions}
                    value={bathroomsFilter}
                    onChange={handleBathroomsChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Property Type
                  </label>
                  <DropDownList
                    data={propertyTypes}
                    value={propertyType}
                    onChange={handlePropertyTypeChange}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Results Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {filteredProperties.length} Properties Found
          </h2>
          <div className="flex space-x-2">
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
          </div>
        </div>

        {/* Results */}
        {filteredProperties.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredProperties.map((property) => (
              <Card key={property.id} className="shadow-sm">
                {viewMode === "grid" ? (
                  <>
                    <div className="relative">
                      <Image
                        width={400}
                        height={192}
                        src={property.image || `/placeholder.svg`}
                        alt={property.name}
                        className="w-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full shadow-sm w-8 h-8 flex items-center justify-center">
                        <Button
                          fillMode={"flat"}
                          className="rounded-full p-2 shadow-sm"
                          onClick={() => handleToggleFavourite(property.id)}
                        >
                          <SvgIcon
                            icon={heartOutlineIcon}
                            className={
                              favourites.includes(property.id)
                                ? "text-red-500"
                                : "text-gray-400"
                            }
                            size="large"
                          />
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
                          <SvgIcon
                            icon={homeIcon}
                            size="large"
                            className="mr-1"
                          />{" "}
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
                      height={150}
                      src={property.image || `/placeholder.svg`}
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
                          onClick={() => handleToggleFavourite(property.id)}
                        >
                          <SvgIcon
                            icon={heartOutlineIcon}
                            className={
                              favourites.includes(property.id)
                                ? "text-red-500"
                                : "text-gray-400"
                            }
                            size="large"
                          />
                        </Button>
                      </div>
                      <p className="text-gray-600 flex items-center mb-2">
                        <SvgIcon
                          icon={mapMarkerIcon}
                          size="large"
                          className="mr-1"
                        />{" "}
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
                          <SvgIcon
                            icon={homeIcon}
                            size="large"
                            className="mr-1"
                          />{" "}
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
              <Search size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search filters to find more properties.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setPriceRange({ start: 0, end: 2000000 });
                  setBedroomsFilter("Any");
                  setBathroomsFilter("Any");
                  setPropertyType("Any");
                }}
              >
                Reset Filters
              </Button>
            </CardBody>
          </Card>
        )}
      </main>
    </MetaTitle>
  );
}
