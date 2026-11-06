"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { User, Mail, Phone, Calendar, Shield, Building2, UserCheck, Landmark, Ban, CheckCircle } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

interface UserDetail {
  id: string;
  email: string;
  full_name: string;
  user_type: "Business" | "Consultant" | "Regulator";
  phone: string | null;
  preferred_language: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await adminApi.getUsers({ search: "", page: 1, limit: 100 });
        const foundUser = (data || []).find((u: UserDetail) => u.id === userId);
        setUser(foundUser || null);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [userId]);

  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      await adminApi.updateUserStatus(user.id, !user.is_active);
      setUser({ ...user, is_active: !user.is_active });
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "Business":
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case "Consultant":
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      case "Regulator":
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner-lg mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card text-center py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
          <User className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2">User Not Found</h3>
        <p className="text-muted text-sm">The requested user does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="gold-gradient text-navy flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-sm">
            <User className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-navy truncate">{user.full_name}</h2>
            <div className="flex items-center gap-1.5 text-sm text-muted">
              {getUserTypeIcon(user.user_type)}
              <span>{user.user_type}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleToggleStatus}
          className={
            user.is_active
              ? "btn-outline border-red-600! text-red-600! hover:bg-red-50!"
              : "btn-primary bg-emerald-600! hover:bg-emerald-700!"
          }
        >
          {user.is_active ? (
            <>
              <Ban className="w-4 h-4 inline mr-2" />
              Suspend User
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Activate User
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">User Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Email</p>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Phone</p>
                <p className="text-sm text-muted">{user.phone || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Preferred Language</p>
                <p className="text-sm text-muted">{user.preferred_language}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Account Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Created At</p>
                <p className="text-sm text-muted">{new Date(user.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Last Login</p>
                <p className="text-sm text-muted">{user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy mb-1">Status</p>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${
                    user.is_active ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-red-50 text-red-700 ring-red-100"
                  }`}
                >
                  {user.is_active ? "Active" : "Suspended"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}