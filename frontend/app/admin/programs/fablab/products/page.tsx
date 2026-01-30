"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Package,
  ArrowLeft,
  Beaker,
  Factory,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { EditableHeroSection } from "@/components/editable-hero-section";
import type { FabLabHero, FabLabProduct } from "@/lib/api-types";
import {
  createProduct as createProductAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
} from "@/lib/api-programs/fablab/api-programs-fablab-products";

interface Product {
  id: string;
  name: string;
  category: "Science Kits" | "Manufacturing Solution";
  subcategory?: string;
  price: string;
  availability: string;
  description: string;
  overview: string;
  keyFeatures: string[];
  whatsIncluded: string[];
  applications: string[];
  image: string | File | null;
  imagePreview?: string; // For displaying preview of File objects
}

interface HeroData {
  badge: string;
  title: string;
  description: string;
  image?: string;
}

export default function ProductsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // Temporary raw string for Applications field to allow free typing with commas
  const [applicationsRaw, setApplicationsRaw] = useState<string>("");

  const [heroData, setHeroData] = useState<HeroData>({
    badge: "Product Management",
    title: "Products",
    description: "Manage FabLab products and educational kits",
    image: "",
  });

  // Statistics will be calculated from products, no need for state

  // Products Data
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const [heroRes, productsRes] = await Promise.all([
          fetch("/api/programs/fablab/products/hero"),
          fetch("/api/programs/fablab/products"),
        ]);

        if (!heroRes.ok || !productsRes.ok) {
          throw new Error("Failed to load products content");
        }

        const heroData = (await heroRes.json()) as FabLabHero | null;
        const productsData = (await productsRes.json()) as any[]; // Backend returns BackendProduct format

        if (!isMounted) return;

        if (heroData) {
          setHeroData({
            badge: heroData.badge || "",
            title: heroData.title || "",
            description: heroData.description || "",
            image: heroData.image || "",
          });
        } else {
          // Set empty defaults if no hero data
          setHeroData({
            badge: "",
            title: "",
            description: "",
            image: "",
          });
        }
        // Stats will be calculated from products, no need to set them here
        // Transform backend products to match Product interface
        // The API returns BackendProduct format, need to transform it
        const transformedProducts: Product[] = productsData.map((p: any) => {
          const features =
            p.FabLabProductFeatures?.map((f: any) => f.feature) ||
            p.keyFeatures ||
            p.features ||
            [];
          const applications =
            p.FabLabProductApplications?.map((a: any) => a.application) ||
            p.applications ||
            [];
          let whatsIncluded: string[] = [];
          if (p.whats_included) {
            try {
              whatsIncluded = JSON.parse(p.whats_included);
            } catch {
              whatsIncluded =
                typeof p.whats_included === "string"
                  ? p.whats_included
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                  : [];
            }
          }
          const pTitleLower = (p.title || "").toLowerCase();
          const pDescLower = (p.description || "").toLowerCase();
          const pCategory =
            pTitleLower.includes("manufacturing") ||
            pTitleLower.includes("agricultural") ||
            pDescLower.includes("manufacturing") ||
            pDescLower.includes("agricultural")
              ? "Manufacturing Solution"
              : "Science Kits";

          return {
            id: String(p.id),
            name: p.title || p.name || "",
            category: pCategory as "Science Kits" | "Manufacturing Solution",
            subcategory: p.subcategory,
            price:
              typeof p.price === "number"
                ? `ETB ${p.price.toFixed(2)}`
                : p.price || "",
            availability:
              p.status === "out of stock"
                ? "Out of Stock"
                : p.status === "coming soon"
                ? "Pre-order"
                : "Available",
            description: p.description || "",
            overview: p.product_overview || p.overview || "",
            keyFeatures: features,
            whatsIncluded: whatsIncluded,
            applications: applications,
            image: p.image || "",
          };
        });
        setProducts(transformedProducts);
        setLoadError(null);
      } catch (e) {
        console.error("[Admin Products] load error", e);
        setLoadError(
          "Unable to load the latest products content. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // First, try to get existing hero to determine if we should POST or PUT
      const existingHeroRes = await fetch("/api/programs/fablab/products/hero");
      const existingHero = existingHeroRes.ok
        ? ((await existingHeroRes.json()) as any)
        : null;

      let heroRes: Response;
      if (existingHero && existingHero.id) {
        // Update existing hero
        heroRes = await fetch("/api/programs/fablab/products/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: existingHero.id,
            badge: heroData.badge,
            title: heroData.title,
            description: heroData.description,
            image: heroData.image,
          }),
        });
      } else {
        // Create new hero
        heroRes = await fetch("/api/programs/fablab/products/hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            badge: heroData.badge,
            title: heroData.title,
            description: heroData.description,
            image: heroData.image,
          }),
        });
      }

      if (!heroRes.ok) {
        throw new Error("Failed to save products content.");
      }

      // Update hero state with the saved data
      const savedHero = await heroRes.json();
      if (savedHero) {
        setHeroData({
          badge: savedHero.badge || "",
          title: savedHero.title || "",
          description: savedHero.description || "",
          image: savedHero.image || "",
        });
      }

      alert("Products page updated successfully!");
    } catch (error) {
      console.error("[Admin Products] Error saving:", error);
      alert("Error saving page. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Product handlers
  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      category: "Science Kits",
      subcategory: "",
      price: "",
      availability: "Available",
      description: "",
      overview: "",
      keyFeatures: [],
      whatsIncluded: [],
      applications: [],
      image: null,
      imagePreview: undefined,
    };
    setEditingProduct(newProduct);
    setApplicationsRaw(""); // Initialize empty
    setIsProductDialogOpen(true);
  };

  const editProduct = (product: Product) => {
    setEditingProduct({
      ...product,
      image: product.image, // This will be a string URL for existing items
      imagePreview: undefined, // No preview needed for existing URLs
    });
    // Initialize raw applications string
    setApplicationsRaw(product.applications.join(", "));
    setIsProductDialogOpen(true);
  };

  const saveProduct = async () => {
    if (!editingProduct) return;

    try {
      // Process applications from raw string
      const processedApplications = applicationsRaw
        .split(",")
        .map((app) => app.trim())
        .filter(Boolean);

      const existing = products.find((p) => p.id === editingProduct.id);

      let savedProduct: any;
      if (existing) {
        // Update existing product
        savedProduct = await updateProductAPI(editingProduct.id, {
          name: editingProduct.name,
          category: editingProduct.category,
          subcategory: editingProduct.subcategory,
          price: editingProduct.price,
          availability: editingProduct.availability,
          description: editingProduct.description,
          overview: editingProduct.overview,
          keyFeatures: editingProduct.keyFeatures,
          whatsIncluded: editingProduct.whatsIncluded,
          applications: processedApplications,
          image: editingProduct.image,
        });
      } else {
        // Create new product
        savedProduct = await createProductAPI({
          name: editingProduct.name,
          category: editingProduct.category,
          subcategory: editingProduct.subcategory,
          price: editingProduct.price,
          availability: editingProduct.availability,
          description: editingProduct.description,
          overview: editingProduct.overview,
          keyFeatures: editingProduct.keyFeatures,
          whatsIncluded: editingProduct.whatsIncluded,
          applications: processedApplications,
          image: editingProduct.image,
        });
      }

      // Transform backend product to frontend format
      const transformedProduct: Product = {
        id: String(savedProduct.id),
        name: savedProduct.title || "",
        category: (() => {
          const titleLower = (savedProduct.title || "").toLowerCase();
          const descLower = (savedProduct.description || "").toLowerCase();
          return titleLower.includes("manufacturing") ||
            titleLower.includes("agricultural") ||
            descLower.includes("manufacturing") ||
            descLower.includes("agricultural")
            ? "Manufacturing Solution"
            : "Science Kits";
        })() as "Science Kits" | "Manufacturing Solution",
        subcategory: undefined, // Backend doesn't have subcategory
        price:
          typeof savedProduct.price === "number"
            ? `ETB ${savedProduct.price.toFixed(2)}`
            : savedProduct.price || "",
        availability:
          savedProduct.status === "out of stock"
            ? "Out of Stock"
            : savedProduct.status === "coming soon"
            ? "Pre-order"
            : "Available",
        description: savedProduct.description || "",
        overview: savedProduct.product_overview || "",
        keyFeatures:
          savedProduct.FabLabProductFeatures?.map((f: any) => f.feature) || [],
        whatsIncluded: (() => {
          if (!savedProduct.whats_included) return [];
          try {
            return JSON.parse(savedProduct.whats_included);
          } catch {
            return typeof savedProduct.whats_included === "string"
              ? savedProduct.whats_included
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : [];
          }
        })(),
        applications:
          savedProduct.FabLabProductApplications?.map(
            (a: any) => a.application
          ) || [],
        image: savedProduct.image || "",
      };

      // Update local state
      if (existing) {
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? transformedProduct : p
          )
        );
      } else {
        setProducts([...products, transformedProduct]);
      }

      // Clean up preview URL if it exists
      if (editingProduct.imagePreview) {
        URL.revokeObjectURL(editingProduct.imagePreview);
      }

      setIsProductDialogOpen(false);
      setEditingProduct(null);
      setApplicationsRaw(""); // Reset
    } catch (error: any) {
      console.error("[Admin Products] Error saving product:", error);
      alert(error.message || "Error saving product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProductAPI(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("[Admin Products] Error deleting product:", error);
      alert(error.message || "Error deleting product. Please try again.");
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      // Clean up old preview URL if it exists
      if (editingProduct.imagePreview) {
        URL.revokeObjectURL(editingProduct.imagePreview);
      }
      // Store the File object and create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setEditingProduct({
        ...editingProduct,
        image: file, // Store File object instead of base64
        imagePreview: previewUrl, // For preview display
      });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 px-6 pt-6">
        <Link
          href="/admin/programs/fablab"
          className="flex items-center gap-2 text-[#367375] hover:text-[#24C3BC] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to FabLab</span>
        </Link>
      </div>

      <div className="px-6 py-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Loading products content…
          </p>
        )}
        {!isLoading && loadError && (
          <p className="text-sm text-amber-600">{loadError}</p>
        )}
      </div>

      <div className="px-6 py-6">
        <EditableHeroSection data={heroData} onSave={setHeroData} />
      </div>

      <div className="px-6 pb-6">
        {/* Statistics calculated from products */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>
              Automatically calculated from products
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const totalProducts = products.length;
              const educationalCount = products.filter(
                (p) => p.category === "Science Kits"
              ).length;
              const manufacturingCount = products.filter(
                (p) => p.category === "Manufacturing Solution"
              ).length;
              const inStockCount = products.filter(
                (p) => p.availability === "Available"
              ).length;

              const calculatedStats = [
                {
                  id: "total",
                  number: totalProducts.toString(),
                  title: "Total Products",
                  icon: Package,
                },
                {
                  id: "educational",
                  number: educationalCount.toString(),
                  title: "Science Kits",
                  icon: Beaker,
                },
                {
                  id: "manufacturing",
                  number: manufacturingCount.toString(),
                  title: "Manufacturing Solutions",
                  icon: Factory,
                },
                {
                  id: "inStock",
                  number: inStockCount.toString(),
                  title: "In Stock",
                  icon: CheckCircle2,
                },
              ];

              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {calculatedStats.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                      <div
                        key={stat.id}
                        className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-[#24C3BC]/20 text-center"
                      >
                        <div className="w-10 h-10 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-[#367375] mb-1">
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      <div className="p-6 max-w-6xl">
        <div className="space-y-6">
          {/* Products Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Products Catalog</CardTitle>
                  <CardDescription>
                    Manage available products and kits
                  </CardDescription>
                </div>
                <Button
                  onClick={addProduct}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="h-64 md:h-auto bg-muted">
                        {product.image || product.imagePreview ? (
                          <img
                            src={
                              product.imagePreview ||
                              (typeof product.image === "string"
                                ? product.image
                                : "/placeholder.svg")
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2 p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs border-[#00BFA6] text-[#00BFA6]"
                              >
                                {product.category}
                              </Badge>
                              {product.subcategory && (
                                <Badge variant="secondary" className="text-xs">
                                  {product.subcategory}
                                </Badge>
                              )}
                              <Badge
                                variant={
                                  product.availability === "Available"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs bg-[#00BFA6]"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {product.availability}
                              </Badge>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                              {product.name}
                            </h3>
                            <p className="text-2xl font-bold text-[#00BFA6] mb-3">
                              {product.price}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editProduct(product)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {product.overview && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-[#00BFA6] flex items-center justify-center text-white">
                                <Package className="h-4 w-4" />
                              </div>
                              Product Overview
                            </h4>
                            <p className="text-sm text-gray-600">
                              {product.overview}
                            </p>
                          </div>
                        )}

                        {product.keyFeatures.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-[#00BFA6] flex items-center justify-center text-white">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                              Key Features
                            </h4>
                            <ul className="grid md:grid-cols-2 gap-2">
                              {product.keyFeatures.map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm flex items-start gap-2"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-[#00BFA6] mt-0.5 shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {product.whatsIncluded.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-[#00BFA6] flex items-center justify-center text-white">
                                <Package className="h-4 w-4" />
                              </div>
                              What's Included
                            </h4>
                            <ul className="space-y-1">
                              {product.whatsIncluded.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm flex items-start gap-2"
                                >
                                  <span className="text-[#00BFA6]">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {product.applications.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-[#00BFA6] flex items-center justify-center text-white">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                              Applications & Uses
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {product.applications.map((app, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {app}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct?.name || "New Product"}</DialogTitle>
            <DialogDescription>
              Add or edit product information
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="e.g., Basic Logic Gates"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Product Category</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(
                      value: "Science Kits" | "Manufacturing Solution"
                    ) =>
                      setEditingProduct({ ...editingProduct, category: value })
                    }
                  >
                    <SelectTrigger id="productCategory">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science Kits">Science Kits</SelectItem>
                      <SelectItem value="Manufacturing Solution">
                        Manufacturing Solution
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productSubcategory">
                    Subcategory (Optional)
                  </Label>
                  <Input
                    id="productSubcategory"
                    placeholder="e.g., Physics, Chemistry, Agriculture"
                    value={editingProduct.subcategory || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        subcategory: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Price</Label>
                  <Input
                    id="productPrice"
                    placeholder="e.g., Br 9,499.00"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productAvailability">Availability</Label>
                  <Select
                    value={editingProduct.availability}
                    onValueChange={(value) =>
                      setEditingProduct({
                        ...editingProduct,
                        availability: value,
                      })
                    }
                  >
                    <SelectTrigger id="productAvailability">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Pre-order">Pre-order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription">Short Description</Label>
                <Textarea
                  id="productDescription"
                  rows={2}
                  placeholder="Brief product description..."
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productOverview">Product Overview</Label>
                <Textarea
                  id="productOverview"
                  rows={3}
                  placeholder="Detailed product overview..."
                  value={editingProduct.overview}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      overview: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productFeatures">
                  Key Features (one per line)
                </Label>
                <Textarea
                  id="productFeatures"
                  rows={4}
                  placeholder={`Feature 1\nFeature 2\nFeature 3`}
                  value={editingProduct.keyFeatures.join("\n")}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      keyFeatures: e.target.value.split("\n"),
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productIncluded">
                  What's Included (one per line)
                </Label>
                <Textarea
                  id="productIncluded"
                  rows={4}
                  placeholder={`Item 1\nItem 2\nItem 3`}
                  value={editingProduct.whatsIncluded.join("\n")}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      whatsIncluded: e.target.value.split("\n"),
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productApplications">
                  Applications (comma-separated)
                </Label>
                <Textarea
                  id="productApplications"
                  rows={2}
                  placeholder="Application 1, Application 2, Application 3"
                  value={applicationsRaw}
                  onChange={(e) => {
                    // Store raw value - user can type commas and Enter freely
                    setApplicationsRaw(e.target.value);
                  }}
                  onKeyDownCapture={(e) => {
                    // Catch Enter at capture phase before Dialog sees it
                    if (
                      e.key === "Enter" &&
                      e.target instanceof HTMLTextAreaElement
                    ) {
                      e.stopPropagation();
                    }
                  }}
                  onKeyDown={(e) => {
                    // Stop Enter key from bubbling up to Dialog
                    // Allow default behavior for both Enter (new line) and comma (separation)
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      // Don't prevent default - let textarea handle Enter normally
                    }
                    // Comma key should work normally - no need to handle it
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productImage">Product Image</Label>
                <div className="space-y-3">
                  <Input
                    id="productImage"
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                  />
                  {(editingProduct.image || editingProduct.imagePreview) && (
                    <div className="h-48 rounded-lg overflow-hidden border">
                      <img
                        src={
                          editingProduct.imagePreview ||
                          (typeof editingProduct.image === "string"
                            ? editingProduct.image
                            : "/placeholder.svg")
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsProductDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveProduct}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
