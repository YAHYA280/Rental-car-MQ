"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";

const DashboardSettingsContent = () => {
  const [companySettings, setCompanySettings] = useState({
    name: "MELHOR QUE NADA",
    email: "info@melhorquenada.com",
    phone: "+212612077309",
    address: "RUE 8 ENNASR LOT 635 TANGER",
    website: "www.melhorquenada.com",
    taxId: "MA123456789",
  });

  const [userSettings, setUserSettings] = useState({
    name: "Admin User",
    email: "admin@melhorquenada.com",
    phone: "+212612077309",
    role: "Administrator",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailBookings: true,
    emailPayments: true,
    emailUsers: true,
    smsBookings: false,
    smsPayments: true,
    pushNotifications: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    language: "en",
    timezone: "Africa/Casablanca",
    currency: "EUR",
    dateFormat: "DD/MM/YYYY",
    autoConfirmBookings: false,
    requireApproval: true,
  });

  const handleCompanySettingChange = (field: string, value: string) => {
    setCompanySettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUserSettingChange = (field: string, value: string) => {
    setUserSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSystemSettingChange = (
    field: string,
    value: string | boolean
  ) => {
    setSystemSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = (section: string) => {
    // Here you would save to your backend
    console.log(`Saving ${section} settings`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your account and system preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) =>
                      handleCompanySettingChange("name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companySettings.email}
                      onChange={(e) =>
                        handleCompanySettingChange("email", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyPhone"
                      value={companySettings.phone}
                      onChange={(e) =>
                        handleCompanySettingChange("phone", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={companySettings.website}
                    onChange={(e) =>
                      handleCompanySettingChange("website", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyAddress"
                      value={companySettings.address}
                      onChange={(e) =>
                        handleCompanySettingChange("address", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={companySettings.taxId}
                    onChange={(e) =>
                      handleCompanySettingChange("taxId", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => saveSettings("company")}
                  className="bg-carbookers-red-600 hover:bg-carbookers-red-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-bold text-2xl">
                  A
                </div>
                <div>
                  <Button variant="outline">Change Avatar</Button>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, GIF or PNG. Max size 1MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    value={userSettings.name}
                    onChange={(e) =>
                      handleUserSettingChange("name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email Address</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) =>
                      handleUserSettingChange("email", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="userPhone">Phone Number</Label>
                  <Input
                    id="userPhone"
                    value={userSettings.phone}
                    onChange={(e) =>
                      handleUserSettingChange("phone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="userRole">Role</Label>
                  <Input
                    id="userRole"
                    value={userSettings.role}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <div className="space-y-4">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => saveSettings("profile")}
                  className="bg-carbookers-red-600 hover:bg-carbookers-red-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailBookings">New Bookings</Label>
                      <p className="text-sm text-gray-500">
                        Get notified when new bookings are made
                      </p>
                    </div>
                    <Switch
                      id="emailBookings"
                      checked={notificationSettings.emailBookings}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailBookings", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailPayments">Payment Updates</Label>
                      <p className="text-sm text-gray-500">
                        Receive payment confirmations and issues
                      </p>
                    </div>
                    <Switch
                      id="emailPayments"
                      checked={notificationSettings.emailPayments}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailPayments", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailUsers">New User Registrations</Label>
                      <p className="text-sm text-gray-500">
                        Know when new users sign up
                      </p>
                    </div>
                    <Switch
                      id="emailUsers"
                      checked={notificationSettings.emailUsers}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailUsers", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  SMS Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsBookings">Urgent Bookings</Label>
                      <p className="text-sm text-gray-500">
                        SMS for urgent booking matters
                      </p>
                    </div>
                    <Switch
                      id="smsBookings"
                      checked={notificationSettings.smsBookings}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("smsBookings", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsPayments">Payment Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Important payment notifications
                      </p>
                    </div>
                    <Switch
                      id="smsPayments"
                      checked={notificationSettings.smsPayments}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("smsPayments", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => saveSettings("notifications")}
                  className="bg-carbookers-red-600 hover:bg-carbookers-red-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Default Language</Label>
                  <Select
                    value={systemSettings.language}
                    onValueChange={(value) =>
                      handleSystemSettingChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={systemSettings.timezone}
                    onValueChange={(value) =>
                      handleSystemSettingChange("timezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Casablanca">
                        Africa/Casablanca (GMT+1)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London (GMT)
                      </SelectItem>
                      <SelectItem value="Europe/Paris">
                        Europe/Paris (GMT+1)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={systemSettings.currency}
                    onValueChange={(value) =>
                      handleSystemSettingChange("currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="MAD">Moroccan Dirham (MAD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={systemSettings.dateFormat}
                    onValueChange={(value) =>
                      handleSystemSettingChange("dateFormat", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold">Booking Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoConfirm">Auto-confirm Bookings</Label>
                      <p className="text-sm text-gray-500">
                        Automatically confirm new bookings without manual review
                      </p>
                    </div>
                    <Switch
                      id="autoConfirm"
                      checked={systemSettings.autoConfirmBookings}
                      onCheckedChange={(checked) =>
                        handleSystemSettingChange(
                          "autoConfirmBookings",
                          checked
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireApproval">
                        Require Admin Approval
                      </Label>
                      <p className="text-sm text-gray-500">
                        New bookings need administrator approval
                      </p>
                    </div>
                    <Switch
                      id="requireApproval"
                      checked={systemSettings.requireApproval}
                      onCheckedChange={(checked) =>
                        handleSystemSettingChange("requireApproval", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => saveSettings("system")}
                  className="bg-carbookers-red-600 hover:bg-carbookers-red-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSettingsContent;
