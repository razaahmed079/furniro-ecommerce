"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Mail,
  MapPin,
  User,
  Package,
  Heart,
  Edit,
  Phone,
  Calendar,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  joinedDate?: string;
  addresses: string[];
  orderHistory: { id: string; date: string; total: string; status: string }[];
  wishlist?: { id: string; name: string; price: string }[];
}

export default function UserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const mockData = {
        ...JSON.parse(storedUser),
        phone: "+1 234-567-8900",
        joinedDate: "January 2024",
        orderHistory: [
          { id: "1", date: "2024-01-15", total: "$50.00", status: "Delivered" },
          {
            id: "2",
            date: "2024-01-10",
            total: "$30.00",
            status: "Processing",
          },
          { id: "3", date: "2024-01-05", total: "$75.00", status: "Shipped" },
        ],
        wishlist: [
          { id: "1", name: "Modern Sofa", price: "$599.99" },
          { id: "2", name: "Dining Table", price: "$399.99" },
          { id: "3", name: "Reading Lamp", price: "$79.99" },
        ],
      };
      setUser(mockData);
      setEditedUser(mockData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/register");
  };

  const handleEditSave = () => {
    if (isEditing && editedUser) {
      setUser(editedUser);
      localStorage.setItem("user", JSON.stringify(editedUser));
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "shipped":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Alert className="max-w-md mb-4">
          <AlertDescription>
            No user profile found. Please register to view your profile.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/register")}>Register Now</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={handleEditSave}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
              <Edit className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Member since {user.joinedDate}</span>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-3 gap-4 mb-4">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <User className="text-gray-400" />
                  <Label>Name:</Label>
                  {isEditing ? (
                    <Input
                      value={editedUser?.name}
                      onChange={(e) =>
                        setEditedUser((prev) => ({
                          ...prev!,
                          name: e.target.value,
                        }))
                      }
                      className="max-w-xs"
                    />
                  ) : (
                    <span>{user.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="text-gray-400" />
                  <Label>Email:</Label>
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="text-gray-400" />
                  <Label>Phone:</Label>
                  {isEditing ? (
                    <Input
                      value={editedUser?.phone}
                      onChange={(e) =>
                        setEditedUser((prev) => ({
                          ...prev!,
                          phone: e.target.value,
                        }))
                      }
                      className="max-w-xs"
                    />
                  ) : (
                    <span>{user.phone}</span>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="text-gray-400 mt-1" />
                  <Label className="mt-1">Addresses:</Label>
                  <div className="flex-1">
                    {user.addresses?.map((address, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        {isEditing ? (
                          <Input
                            value={editedUser?.addresses[index]}
                            onChange={(e) => {
                              const newAddresses = [...editedUser!.addresses];
                              newAddresses[index] = e.target.value;
                              setEditedUser((prev) => ({
                                ...prev!,
                                addresses: newAddresses,
                              }));
                            }}
                          />
                        ) : (
                          <p>{address}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="space-y-4">
                {user.orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Package className="text-gray-400" />
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{order.total}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              <div className="space-y-4">
                {user.wishlist?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Heart className="text-rose-400" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Add to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-500"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-4 border-t text-center">
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
