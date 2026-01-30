"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  User,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { backendApi } from "@/lib/backend-api";

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "editor" | "contributor" | "user";
  is_active: boolean;
  permissions?: Record<string, boolean> | null;
  createdAt?: string;
  updatedAt?: string;
}

// Define all admin pages that can have permissions
const ADMIN_PAGES = [
  { id: 'home', label: 'Home', path: '/admin/home' },
  { id: 'about', label: 'About Us', path: '/admin/about' },
  { id: 'programs', label: 'Programs', path: '/admin/programs' },
  { id: 'latest', label: 'Latest News', path: '/admin/latest' },
  { id: 'contact', label: 'Contact Us', path: '/admin/contact' },
  { id: 'location', label: 'Locations', path: '/admin/location' },
  { id: 'header', label: 'Header Navigation', path: '/admin/header' },
  { id: 'footer', label: 'Footer', path: '/admin/footer' },
  { id: 'account', label: 'Account Management', path: '/admin/account' },
  { id: 'profile', label: 'Profile', path: '/admin/profile' },
];

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "contributor", label: "Contributor" },
  { value: "user", label: "User" },
];

export default function AccountManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<{ role: string; permissions: Record<string, boolean> | null } | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Check if current user is super admin
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Use Next.js API route to avoid CORS issues
        const response = await fetch("/api/users/me", {
          credentials: "include", // Include cookies (JWT) in request
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Redirect to login if unauthorized
            window.location.href = "/admin/login";
            return;
          }
          throw new Error(`Failed to verify access: ${response.statusText}`);
        }
        
        const user = await response.json();
        setCurrentUser(user);
        
        // Only super admin (admin with null permissions) can access account management
        const isSuperAdmin = user.role === "admin" && (user.permissions === null || user.permissions === undefined);
        
        if (!isSuperAdmin) {
          toast({
            title: "Access Denied",
            description: "Only Super Admin can access Account Management.",
            variant: "destructive",
          });
          // Redirect to admin home
          window.location.href = "/admin";
          return;
        }
      } catch (error) {
        console.error("Error checking access:", error);
        toast({
          title: "Error",
          description: "Failed to verify access. Redirecting...",
          variant: "destructive",
        });
        window.location.href = "/admin/login";
      } finally {
        setIsCheckingAccess(false);
      }
    };
    
    checkAccess();
  }, [toast]);

  // Load users from backend
  useEffect(() => {
    if (!isCheckingAccess && currentUser) {
      loadUsers();
    }
  }, [isCheckingAccess, currentUser]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await backendApi.get("/api/users");
      setUsers(data);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUser = async (user: User) => {
    try {
      setIsSaving(true);
      if (editingUser && editingUser.id) {
        // Update existing user
        // If permissions object is empty, send empty object (limited admin with no access)
        // If permissions object has keys, send the object (limited admin with specific access)
        // Note: We don't preserve null here - if user was super admin and permissions are changed, they become limited admin
        const permissionsToSend = user.permissions && Object.keys(user.permissions).length > 0
          ? user.permissions
          : {}; // Empty object = no permissions (limited admin)
        
        await backendApi.put(`/api/users/${user.id}`, {
          name: user.name,
          email: user.email,
          password: user.password || undefined, // Only send if provided
          role: user.role,
          is_active: user.is_active,
          permissions: permissionsToSend,
        });
        toast({
          title: "Success!",
          description: "User has been updated successfully.",
          duration: 3000,
        });
      } else {
        // Create new user
        // For new users, if permissions is empty object, send as empty object (no permissions)
        // null means super admin (full access) - only set manually in database
        const permissionsToSend = user.permissions && Object.keys(user.permissions).length === 0 
          ? {} 
          : user.permissions || null;
        
        await backendApi.post("/api/users", {
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role || "user",
          is_active: user.is_active !== undefined ? user.is_active : true,
          permissions: permissionsToSend,
        });
        toast({
          title: "Success!",
          description: "New user has been created successfully.",
          duration: 3000,
        });
      }
      setEditingUser(null);
      setIsAddingUser(false);
      await loadUsers(); // Reload users list
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await backendApi.delete(`/api/users/${id}`);
      toast({
        title: "Success!",
        description: "User has been deleted successfully.",
        duration: 3000,
      });
      await loadUsers(); // Reload users list
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Show loading while checking access
  if (isCheckingAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#00BFA6]" />
          <p className="mt-4 text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  // If not super admin, don't render (redirect will happen)
  if (!currentUser || !(currentUser.role === "admin" && (currentUser.permissions === null || currentUser.permissions === undefined))) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
        <p className="text-gray-600 mt-2">
          Manage user accounts, roles, and permissions. <strong>Only Super Admin can access this page.</strong>
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage all user accounts and their permissions
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAddingUser(true)}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#00BFA6]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {user.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingUser(user)}
                              className="bg-transparent"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeleting === user.id}
                            >
                              {isDeleting === user.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog
        open={isAddingUser || editingUser !== null}
        onOpenChange={() => {
          setIsAddingUser(false);
          setEditingUser(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              Manage user account information and permissions
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={
              editingUser || {
                id: 0,
                name: "",
                email: "",
                password: "",
                role: "user",
                is_active: true,
                permissions: {}, // Start with empty object for new users (no permissions)
              }
            }
            isEditing={!!editingUser}
            onSave={handleSaveUser}
            onCancel={() => {
              setIsAddingUser(false);
              setEditingUser(null);
            }}
            isSaving={isSaving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserForm({
  user,
  isEditing,
  onSave,
  onCancel,
  isSaving,
}: {
  user: User;
  isEditing: boolean;
  onSave: (user: User) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  // Initialize formData - convert null permissions to empty object for UI (but track if it was null)
  const [formData, setFormData] = useState<User>(() => {
    const initialUser = { ...user };
    // If permissions is null (super admin), convert to empty object for UI editing
    // We'll track this separately if needed
    if (initialUser.permissions === null || initialUser.permissions === undefined) {
      initialUser.permissions = {};
    }
    return initialUser;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [wasSuperAdmin, setWasSuperAdmin] = useState(user.permissions === null || user.permissions === undefined);

  useEffect(() => {
    const updatedUser = { ...user };
    // Convert null to empty object for UI
    if (updatedUser.permissions === null || updatedUser.permissions === undefined) {
      updatedUser.permissions = {};
      setWasSuperAdmin(true);
    } else {
      setWasSuperAdmin(false);
    }
    setFormData(updatedUser);
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="e.g., john@stempower.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password {isEditing ? "(leave blank to keep current)" : "*"}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={
                isEditing ? "Enter new password (optional)" : "Enter password"
              }
              required={!isEditing}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Minimum 8 characters. Must contain uppercase, lowercase, and number.
          </p>
        </div>

          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value: any) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_active">Status</Label>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                {formData.is_active ? "Active" : "Inactive"}
              </Label>
            </div>
          </div>
        </div>

        {/* Page Permissions - Only show for admin and editor roles */}
        {(formData.role === "admin" || formData.role === "editor") && (
          <div className="space-y-4 border-t pt-4 mt-4">
            <div className="space-y-2">
              <Label>Page Permissions</Label>
              {wasSuperAdmin && isEditing && (
                <div className="p-3 bg-yellow-50 rounded border border-yellow-200 mb-3">
                  <p className="text-xs text-yellow-800">
                    <strong>⚠️ Warning:</strong> This user was a Super Admin (full access). 
                    Changing permissions will convert them to a Limited Admin with only selected page access.
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500">
                <strong>Select which pages this user can access and edit.</strong> Only checked pages will be accessible. Unchecked pages will be hidden.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-3 max-h-64 overflow-y-auto p-2 border rounded">
                {ADMIN_PAGES.map((page) => {
                  // Initialize permissions as empty object if null/undefined (for new users)
                  // For existing users, use their current permissions
                  const currentPermissions = formData.permissions === null || formData.permissions === undefined 
                    ? {} 
                    : formData.permissions;
                  
                  // Check if this page has permission
                  const hasPermission = currentPermissions[page.id] === true;
                  
                  return (
                    <div key={page.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`permission-${page.id}`}
                        checked={hasPermission}
                        onChange={(e) => {
                          const updatedPermissions = { ...currentPermissions };
                          
                          if (e.target.checked) {
                            // If checked, add permission
                            updatedPermissions[page.id] = true;
                          } else {
                            // If unchecked, remove permission
                            delete updatedPermissions[page.id];
                          }
                          
                          // Always set as object (never null) for limited admins
                          // Only super admin should have null permissions (set manually if needed)
                          setFormData({
                            ...formData,
                            permissions: updatedPermissions,
                          });
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-[#00BFA6] focus:ring-[#00BFA6]"
                      />
                      <Label
                        htmlFor={`permission-${page.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {page.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-xs text-blue-800">
                  <p className="font-semibold mb-2">How Permissions Work:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><strong>Checked pages:</strong> User can access and edit these pages</li>
                    <li><strong>Unchecked pages:</strong> Hidden from sidebar, user cannot access</li>
                    <li><strong>Account Management:</strong> Only Super Admin (permissions = null) can access</li>
                    <li><strong>Super Admin:</strong> Must have permissions = null (set in database, not via UI)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(formData)}
          className="bg-[#00BFA6] hover:bg-[#00A693]"
          disabled={
            isSaving ||
            !formData.name ||
            !formData.email ||
            (!isEditing && !formData.password)
          }
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Update User" : "Create User"}
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
