"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  UserCheck,
  Users,
  UserPlus,
  Calendar,
  Mail,
} from "lucide-react";

const DashboardUsersContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userToBlock, setUserToBlock] = useState<string | null>(null);

  // Mock users data
  const [users] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+212612345678",
      joinDate: "2024-01-15",
      status: "active",
      totalBookings: 12,
      totalSpent: 2450,
      lastBooking: "2024-12-10",
      avatar: "SJ",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+212623456789",
      joinDate: "2024-02-20",
      status: "active",
      totalBookings: 8,
      totalSpent: 1680,
      lastBooking: "2024-12-08",
      avatar: "MC",
    },
    {
      id: "3",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+212634567890",
      joinDate: "2024-03-10",
      status: "inactive",
      totalBookings: 3,
      totalSpent: 420,
      lastBooking: "2024-10-15",
      avatar: "ED",
    },
    {
      id: "4",
      name: "Ahmed Hassan",
      email: "ahmed.hassan@email.com",
      phone: "+212645678901",
      joinDate: "2024-04-05",
      status: "blocked",
      totalBookings: 15,
      totalSpent: 3200,
      lastBooking: "2024-11-28",
      avatar: "AH",
    },
    {
      id: "5",
      name: "Fatima Al-Zahra",
      email: "fatima.alzahra@email.com",
      phone: "+212656789012",
      joinDate: "2024-05-18",
      status: "active",
      totalBookings: 6,
      totalSpent: 980,
      lastBooking: "2024-12-05",
      avatar: "FA",
    },
  ]);

  // Filter users based on search and filter criteria
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesFilter =
      selectedFilter === "all" || user.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Users",
      value: users.filter((user) => user.status === "active").length.toString(),
      icon: UserCheck,
      color: "green",
    },
    {
      title: "New This Month",
      value: "8",
      icon: UserPlus,
      color: "purple",
    },
    {
      title: "Blocked Users",
      value: users
        .filter((user) => user.status === "blocked")
        .length.toString(),
      icon: Ban,
      color: "red",
    },
  ];

  const handleBlockUser = (userId: string) => {
    // Here you would update the user status in your backend
    console.log("Block user:", userId);
    setUserToBlock(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">
            Manage customer accounts and user information
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="ml-4">
                  <div
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                All Users
              </Button>
              <Button
                variant={selectedFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={selectedFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("inactive")}
              >
                Inactive
              </Button>
              <Button
                variant={selectedFilter === "blocked" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("blocked")}
              >
                Blocked
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>
            Customer Directory ({filteredUsers.length} users)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Booking</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">ID: {user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        📞 {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{user.totalBookings}</p>
                    <p className="text-sm text-gray-600">bookings</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-gray-900">
                      €{user.totalSpent}
                    </p>
                    <p className="text-sm text-gray-600">lifetime</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600">
                      {new Date(user.lastBooking).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "blocked" ? (
                          <DropdownMenuItem className="text-green-600">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Unblock User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setUserToBlock(user.id)}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog
        open={selectedUser !== null}
        onOpenChange={() => setSelectedUser(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the customer account
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-bold text-xl">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Email:</span>{" "}
                      {selectedUser.email}
                    </p>
                    <p>
                      <span className="text-gray-600">Phone:</span>{" "}
                      {selectedUser.phone}
                    </p>
                    <p>
                      <span className="text-gray-600">Joined:</span>{" "}
                      {new Date(selectedUser.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Booking Statistics
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Total Bookings:</span>{" "}
                      {selectedUser.totalBookings}
                    </p>
                    <p>
                      <span className="text-gray-600">Total Spent:</span> €
                      {selectedUser.totalSpent}
                    </p>
                    <p>
                      <span className="text-gray-600">Last Booking:</span>{" "}
                      {new Date(selectedUser.lastBooking).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
            <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700">
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block User Confirmation Dialog */}
      <Dialog
        open={userToBlock !== null}
        onOpenChange={() => setUserToBlock(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block this user? They will not be able to
              make new bookings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToBlock(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => userToBlock && handleBlockUser(userToBlock)}
            >
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardUsersContent;
