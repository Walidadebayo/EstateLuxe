"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@progress/kendo-react-buttons";
import { Card, CardBody } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import {
  Home,
  Search,
  Bed,
  Bath,
  ArrowRight,
  Building,
  Key,
  Briefcase,
  Users,
  Star,
  Bot,
} from "lucide-react";

import { mockProperties } from "@/lib/mock-data";
import NextImage from "next/image";
import CountUp from "@/components/ui/TextAnimations/CountUp/CountUp";
import { SvgIcon } from "@progress/kendo-react-common";
import {
  arrowRightIcon,
  mapMarkerIcon,
  searchIcon,
} from "@progress/kendo-svg-icons";
import CircularGallery from "@/components/ui/Components/CircularGallery/CircularGallery";
import TrueFocus from "@/components/ui/TextAnimations/TrueFocus/TrueFocus";
import useMounted from "@/hooks/useMounted";
import { ScrollView } from "@progress/kendo-react-scrollview";
import { useIsMobile } from "@/hooks/use-mobile";
import RollingGallery from "@/components/ui/Components/RollingGallery/RollingGallery";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Home Buyer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "EstateLuxe made finding my dream home so easy. The AI assistant was incredibly helpful in narrowing down properties that matched my preferences.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Property Investor",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "As an investor, I need detailed information and quick responses. This platform delivers both with its comprehensive property data and responsive team.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "First-time Buyer",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "The mortgage calculator and AI recommendations helped me understand what I could afford. I found a perfect starter home within my budget!",
    rating: 4,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const mounted = useMounted();
  const isMobile = useIsMobile();

  const handleSearch = () => {
    router.push(`/search?q=${searchQuery}`);
  };

  const handleViewProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const handleViewAllProperties = () => {
    router.push("/search");
  };

  return (
    <>
      <div className="relative sm:h-[80vh] overflow-hiden">
        <div className="absolute inset-0 bg-cover bg-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')",
              filter: "brightness(0.7)",
            }}
          />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <TrueFocus
              sentence="Find Your Dream Home"
              manualMode={false}
              blurAmount={3}
              borderColor="var(--kendo-color-primary)"
              animationDuration={1}
              pauseBetweenAnimations={0.5}
            />
          </h1>

          <p className="text-xl text-white mb-8 max-w-2xl">
            Discover the perfect property with our AI-powered real estate
            platform
          </p>

          <div className="w-full max-w-3xl bg-background rounded-lg shadow-xl ">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-4">
                <div className="flex items-center">
                  <Search className="text-gray-400 mr-2" size={20} />
                  <Input
                    placeholder="Search by location, property type, or features..."
                    value={searchQuery}
                    name="q"
                    onChange={(e) => setSearchQuery(e.target.value as string)}
                    className="w-full border-none shadow-none"
                  />
                </div>
              </div>
              <Button
                startIcon={<SvgIcon icon={searchIcon} />}
                type="submit"
                themeColor={"primary"}
                className="m-1 md:m-2 px-6"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex gap-4 my-5 sm:absolute sm:bottom-7 flex-wrap justify-center">
            <Button
              fillMode="flat"
              className="bg-background/80 !text-white hover:bg-background/30 backdrop-blur-sm"
              onClick={() => router.push("/search")}
              startIcon={<Search size={18} className="mr-2" />}
              size={"large"}
            >
              Browse Properties
            </Button>
            <Button
              fillMode="flat"
              className="bg-background/80 !text-white hover:bg-background/30 backdrop-blur-sm"
              onClick={() => router.push("/ai-assistant")}
              startIcon={<Bot size={18} className="mr-2" />}
              size={"large"}
            >
              AI Assistant
            </Button>
          </div>
        </div>
      </div>

      <section className={!isMobile ? "h-[600px] relative" : ""}>
        {!isMobile ? (
          <CircularGallery
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            items={mockProperties.slice(0, 6).map((property) => {
              return {
                image: property.image || "/placeholder.svg",
                text: property.name,
              };
            })}
          />
        ) : (
          <RollingGallery
            autoplay={false}
            pauseOnHover={true}
            images={mockProperties.slice(0, 6).map((property) => {
              return property.image || "/placeholder.svg";
            })}
          />
        )}
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="flex sm:justify-between items-center justify-center sm:flex-row flex-col text-center mb-12">
            <h2 className="text-3xl font-bold text-center">
              Featured Properties
            </h2>
            <p className="text-foreground mt-2">
              Explore our handpicked selection of premium properties
            </p>
          </div>

          <div className="flex justify-end mb-4">
            <Button
              themeColor={"primary"}
              className="flex items-center"
              onClick={handleViewAllProperties}
              endIcon={<ArrowRight size={16} className="ml-2" />}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProperties.slice(0, 6).map((property) => (
              <div key={property.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden group">
                    <NextImage
                      width={400}
                      height={256}
                      src={
                        property.image ||
                        `/placeholder.svg?height=250&width=400`
                      }
                      alt={property.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {property.status}
                    </div>
                  </div>
                  <CardBody>
                    <h3 className="font-bold text-xl mb-2 hover:text-primary transition-colors duration-300">
                      {property.name}
                    </h3>
                    <p className="text-foreground flex items-center mb-4">
                      <SvgIcon
                        icon={mapMarkerIcon}
                        className="mr-1 text-primary"
                      />{" "}
                      {property.location}
                    </p>
                    <p className="text-2xl font-bold text-primary mb-4">
                      ${property.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between text-foreground mb-4">
                      <span className="flex items-center">
                        <Bed size={16} className="mr-1" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center">
                        <Bath size={16} className="mr-1" /> {property.bathrooms}
                      </span>
                      <span className="flex items-center">
                        <Home size={16} className="mr-1" /> {property.sqft} sqft
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleViewProperty(property.id)}
                    >
                      View Details
                    </Button>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-foreground max-w-2xl mx-auto">
                We provide comprehensive real estate services to help you buy,
                sell, or rent properties with ease
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                <CardBody className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Property Listings</h3>
                  <p className="text-foreground">
                    Browse our extensive collection of properties for sale and
                    rent across multiple locations
                  </p>
                </CardBody>
              </Card>
            </div>

            <div>
              <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                <CardBody className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Key className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    Property Management
                  </h3>
                  <p className="text-foreground">
                    Comprehensive management services for property owners and
                    landlords
                  </p>
                </CardBody>
              </Card>
            </div>

            <div>
              <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                <CardBody className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    Investment Advisory
                  </h3>
                  <p className="text-foreground">
                    Expert advice on real estate investments to maximize your
                    returns
                  </p>
                </CardBody>
              </Card>
            </div>

            <div>
              <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                <CardBody className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bot className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">AI Assistant</h3>
                  <p className="text-foreground">
                    Get personalized property recommendations and real estate
                    advice from our AI
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-foreground max-w-2xl mx-auto">
                Hear from our satisfied clients about their experience with
                EstateLuxe
              </p>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 gap-6"> */}
          {mounted && (
            <ScrollView
              className="mb-8 grid place-items-center lg:!h-48 !rounded-xl !bg-gray-300 dark:!bg-[var(--kendo-color-dark)]"
              style={{
                width: "100%",
                height: 400,
              }}
              automaticViewChange={false}
              endless
              pageable={false}
            >
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="mx-auto !border-none !bg-gray-300 dark:!bg-[var(--kendo-color-dark)]"
                >
                  <CardBody className="p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <NextImage
                        width={96}
                        height={96}
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-foreground text-wrap whitespace-pre-wrap italic mb-4 text-lg">
                          &quot;{testimonial.text}&quot;
                        </p>
                        <div>
                          <h4 className="font-bold text-lg">
                            {testimonial.name}
                          </h4>
                          <p className="text-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </ScrollView>
          )}
        </div>
        {/* </div> */}
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">
                <CountUp from={0} to={1000} />
              </h3>
              <p className="text-white/80">Properties Listed</p>
            </div>

            <div>
              <h3 className="text-4xl font-bold mb-2">
                <CountUp from={0} to={500} />
              </h3>
              <p className="text-white/80">Happy Clients</p>
            </div>

            <div>
              <h3 className="text-4xl font-bold mb-2">
                <CountUp from={0} to={100} />
              </h3>
              <p className="text-white/80">Expert Agents</p>
            </div>

            <div>
              <h3 className="text-4xl font-bold mb-2">
                <CountUp from={0} to={50} />
              </h3>
              <p className="text-white/80">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div>
            <div className="bg-gradient-to-r from-primary to-primary/70 rounded-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Find Your Dream Home?
                  </h2>
                  <p className="text-white/90 mb-8 text-lg">
                    Let our AI assistant help you discover the perfect property
                    that matches your preferences and budget.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      className="bg-background text-primary hover:bg-gray-100"
                      onClick={() => router.push("/search")}
                    >
                      Browse Properties
                    </Button>
                    <Button
                      fillMode="outline"
                      className="border-white text-white hover:bg-background/10"
                      onClick={() => router.push("/ai-assistant")}
                      startIcon={<Bot size={18} className="mr-2" />}
                    >
                      Chat with AI Assistant
                    </Button>
                  </div>
                </div>
                <div className="lg:w-1/2 relative">
                  <NextImage
                    width={600}
                    height={400}
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2346&q=80"
                    alt="Modern home interior"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose EstateLuxe</h2>
              <p className="text-foreground max-w-2xl mx-auto">
                Our platform offers unique features to make your real estate
                experience seamless
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardBody className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Bot className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">
                        AI-Powered Recommendations
                      </h3>
                      <p className="text-foreground">
                        Our advanced AI analyses your preferences to suggest
                        properties that match your needs perfectly.
                      </p>
                      <Button
                        fillMode="flat"
                        className="mt-4 p-0 flex items-center text-primary"
                        onClick={() => router.push("/ai-assistant")}
                        endIcon={<SvgIcon icon={arrowRightIcon} />}
                      >
                        Try AI Assistant
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardBody className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Users className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                      <p className="text-foreground">
                        Our team of real estate professionals is available to
                        guide you through every step of your journey.
                      </p>
                      <Button
                        fillMode="flat"
                        className="mt-4 p-0 flex items-center text-primary"
                        onClick={() => router.push("/contact")}
                        endIcon={<SvgIcon icon={arrowRightIcon} />}
                      >
                        Contact Us
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardBody className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Building className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">
                        Comprehensive Property Data
                      </h3>
                      <p className="text-foreground">
                        Access detailed information about properties,
                        neighborhoods, and market trends to make informed
                        decisions.
                      </p>
                      <Button
                        fillMode="flat"
                        className="mt-4 p-0 flex items-center text-primary"
                        onClick={() => router.push("/search")}
                        endIcon={<SvgIcon icon={arrowRightIcon} />}
                      >
                        Explore Properties
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
