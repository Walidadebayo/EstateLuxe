"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "@progress/kendo-react-layout";
import {
  Map,
  MapLayers,
  MapMarkerLayer,
  MapTileLayer,
  TileUrlTemplateArgs,
} from "@progress/kendo-react-map";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Bed, Bath, MapPin, Phone, Mail } from "lucide-react";
import { ScrollView } from "@progress/kendo-react-scrollview";
import { mockProperties } from "@/lib/mock-data";
import type { PropertyType } from "@/lib/types";
import { PropertyRecommendations } from "@/components/property-recommendations";
import Image from "next/image";
import { SvgIcon } from "@progress/kendo-react-common";
import {
  arrowLeftIcon,
  heartOutlineIcon,
  homeIcon,
  mapMarkerTargetIcon,
} from "@progress/kendo-svg-icons";
import { Loader } from "@progress/kendo-react-indicators";
import useMounted from "@/hooks/useMounted";

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const mounted = useMounted();
  const [isFavourite, setIsFavourite] = useState(false);

  // Mock images for carousel
  const mockImages = [
    {
      position: 1,
      url: property?.image || "https://placehold.co/400x800",
    },
    {
      position: 2,
      url: "https://placehold.co/1000x400?text=Living+Room",
    },
    {
      position: 3,
      url: "https://placehold.co/1000x400?text=Kitchen",
    },
    {
      position: 4,
      url: "https://placehold.co/1000x400?text=Bedroom",
    },
    {
      position: 5,
      url: "https://placehold.co/1000x400?text=Bathroom",
    },
  ];

  // Check if the property is already in favourites
  useEffect(() => {
    const storedFavourites = JSON.parse(
      localStorage.getItem("favourites") || "[]",
    );
    const isFavourite = storedFavourites.some(
      (property: PropertyType) => property.id === id,
    );
    setIsFavourite(isFavourite);
  }, [id]);

  useEffect(() => {
    const foundProperty = mockProperties.find((p) => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
    } else {
      alert("Property not found");
      router.push("/search");
    }
  }, [id, router]);

  if (!property) {
    return (
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 grid place-items-center h-screen">
        <div className="mx-auto max-w-screen-sm text-center flex flex-col items-center">
          <Loader type="infinite-spinner" size="large" />
          Loading property details...
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleContactOwner = () => {
    setShowContactDialog(true);
  };

  const handleCloseDialog = () => {
    setShowContactDialog(false);
  };

  const handleToggleFavourite = () => {
    if (isFavourite) {
      setIsFavourite(false);
      const storedFavourites = JSON.parse(
        localStorage.getItem("favourites") || "[]",
      );
      const updatedStoredFavourites = storedFavourites.filter(
        (property: { id: string }) => property.id !== id,
      );
      localStorage.setItem(
        "favourites",
        JSON.stringify(updatedStoredFavourites),
      );
    } else {
      setIsFavourite(true);
      const storedFavourites = JSON.parse(
        localStorage.getItem("favourites") || "[]",
      );
      const propertyToAdd = mockProperties.find(
        (property) => property.id === id,
      );

      if (propertyToAdd) {
        const updatedStoredFavourites = [...storedFavourites, propertyToAdd];
        localStorage.setItem(
          "favourites",
          JSON.stringify(updatedStoredFavourites),
        );
      }
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Button onClick={handleBack} className="mb-6">
        <SvgIcon icon={arrowLeftIcon} className="mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <p className="flex items-center text-foreground mb-6 dark:text-gray-400">
            <SvgIcon icon={mapMarkerTargetIcon} /> {property.location}
          </p>

          {/* Image Carousel */}

          {mounted && (
            <ScrollView
              className="mb-8"
              style={{
                width: "100%",
                height: 400,
              }}
            >
              {mockImages.map((image, index) => {
                return (
                  <Image
                    src={image.url || "/placeholder.svg"}
                    key={index}
                    alt={`Property image ${index + 1}`}
                    width={1000}
                    height={400}
                    className="w-full h-[400px] object-cover rounded-lg"
                    draggable={false}
                  />
                );
              })}
            </ScrollView>
          )}

          {/* Property Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="text-center p-4 dark:!bg-gray-800">
              <CardBody>
                <div className="flex flex-col items-center">
                  <Bed size={24} className="mb-2 text-primary" />
                  <p className="text-lg font-bold dark:text-gray-200">
                    {property.bedrooms}
                  </p>
                  <p className="text-sm text-foreground dark:text-gray-300">
                    Bedrooms
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="text-center p-4 dark:!bg-gray-800">
              <CardBody>
                <div className="flex flex-col items-center">
                  <Bath size={24} className="mb-2 text-primary" />
                  <p className="text-lg font-bold dark:text-gray-200">
                    {property.bathrooms}
                  </p>
                  <p className="text-sm text-foreground dark:text-gray-300">
                    Bathrooms
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="text-center p-4 dark:!bg-gray-800">
              <CardBody>
                <div className="flex flex-col items-center">
                  <SvgIcon
                    icon={homeIcon}
                    size="large"
                    className="mb-2 text-primary"
                  />
                  <p className="text-lg font-bold dark:text-gray-200">
                    {property.sqft}
                  </p>
                  <p className="text-sm text-foreground dark:text-gray-300">
                    Sq Ft
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="text-center p-4 dark:!bg-gray-800">
              <CardBody>
                <div className="flex flex-col items-center">
                  <div className="mb-2 text-primary font-bold text-lg">$</div>
                  <p className="text-lg font-bold dark:text-gray-200">
                    {property.price ? property.price.toLocaleString() : "0"}
                  </p>
                  <p className="text-sm text-foreground dark:text-gray-300">
                    Price
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Description */}
          <Card className="mb-8 dark:!bg-gray-800">
            <CardBody>
              <CardTitle className="text-xl font-bold mb-4 dark:text-gray-200">
                Description
              </CardTitle>
              <p className="text-foreground dark:text-gray-300">
                {property.description}
              </p>
            </CardBody>
          </Card>

          {/* Features */}
          <Card className="mb-8 dark:!bg-gray-800">
            <CardBody>
              <CardTitle className="text-xl font-bold mb-4 dark:text-gray-200">
                Features
              </CardTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span className="dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Price Card */}
          <Card className="mb-6 dark:!bg-gray-800">
            <CardBody>
              <CardTitle className="text-2xl font-bold text-primary">
                ${property.price ? property.price.toLocaleString() : "0"}
              </CardTitle>
              <CardSubtitle className="text-foreground mb-4 dark:!text-gray-300">
                {property.status}
              </CardSubtitle>
              <ButtonGroup className="w-full">
                <Button className="flex-1" onClick={handleContactOwner}>
                  Contact Owner
                </Button>
                <Button className="flex-none" onClick={handleToggleFavourite}>
                  <SvgIcon
                    icon={heartOutlineIcon}
                    size="large"
                    className={
                      isFavourite
                        ? "text-red-500"
                        : "text-gray-400 dark:text-gray-300"
                    }
                  />
                </Button>
              </ButtonGroup>
            </CardBody>
          </Card>

          {/* Map */}
          <Card className="mb-6 dark:!bg-gray-800">
            <CardBody>
              <CardTitle className="text-xl font-bold mb-4 dark:text-gray-200">
                Location
              </CardTitle>
              <div className="h-[300px] mb-2">
                <Map
                  center={[property.latitude, property.longitude]}
                  zoom={14}
                  style={{ height: "100%" }}
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
                          latlng: [property.latitude, property.longitude],
                          name: property.name,
                        },
                      ]}
                      locationField="latlng"
                      titleField={property.name}
                    />
                  </MapLayers>
                </Map>
              </div>
              <p className="text-foreground flex items-center">
                <MapPin size={16} className="mr-1" /> {property.location}
              </p>
            </CardBody>
          </Card>

          {/* AI Recommendations */}
          <PropertyRecommendations
            currentProperty={property}
            properties={mockProperties}
          />
        </div>
      </div>

      {/* Contact Dialog */}
      {showContactDialog && (
        <Dialog title="Contact Property Owner" onClose={handleCloseDialog}>
          <div className="p-4">
            <p className="mb-4">
              Interested in this property? Fill out the form below to contact
              the owner.
            </p>
            <div className="grid gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Phone
                </label>
                <input
                  type="tel"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="I'm interested in this property..."
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-foreground mb-4 dark:text-gray-300">
              <div className="flex items-center gap-2 mr-4">
                <Phone size={16} /> (555) 123-4567
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} /> contact@estatemanagement.com
              </div>
            </div>
          </div>
          <DialogActionsBar>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleCloseDialog}>Send Message</Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </main>
  );
}
