"use client";

import { useState } from "react";
import { User, Search, MoreVertical, Ban, CheckCircle, Eye, Users as UsersIcon } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface UserTableProps {
  users: Array<{
    id: string;
    email: string;
    full_name: string;
    user_type: "Business" | "Consultant" | "Regulator";
    is_active: boolean;
    last_login: string | null;
    created_at: string;
  }>;
  onStatusChange?: (userId: string, isActive: boolean) => void;
}

export default function UserTable({ users, onStatusChange }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || user.user_type === filterType;
    return matchesSearch && matchesType;
  });

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case "Business":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
      case "Consultant":
        return "bg-purple-50 text-purple-700 ring-1 ring-purple-100";
      case "Regulator":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
      default:
        return "bg-gray-50 text-gray-700 ring-1 ring-gray-100";
    }
  };

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="relative w-full flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold sm:w-auto"
        >
          <option value="all">All Types</option>
          <option value="Business">Business</option>
          <option value="Consultant">Consultant</option>
          <option value="Regulator">Regulator</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EAD9]">
            <UsersIcon className="h-6 w-6 text-muted" />
          </div>
          <p className="text-sm font-medium text-navy">No users found</p>
          <p className="mt-1 text-xs text-muted">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search or filter."
              : "Users will appear here once they register."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-[#FAFAF7]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold/90 to-gold text-white shadow-sm">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy">{user.full_name}</p>
                        <p className="max-w-56 truncate text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getUserTypeBadge(user.user_type)}`}>
                      {user.user_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.is_active ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                      {user.is_active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {user.last_login ? formatDate(user.last_login) : "Never"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{formatDate(user.created_at)}</td>
                  <td className="relative px-6 py-4 text-right">
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
                      className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                      aria-label="Row actions"
                    >
                      <MoreVertical className="h-4 w-4 text-muted" />
                    </button>
                    {dropdownOpen === user.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(null)} />
                        <div className="absolute right-6 top-12 z-20 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-navy hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" /> View Details
                          </Link>
                          <button
                            onClick={() => {
                              onStatusChange?.(user.id, !user.is_active);
                              setDropdownOpen(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            {user.is_active ? (
                              <>
                                <Ban className="h-4 w-4 text-red-600" /> <span className="text-red-600">Suspend User</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-emerald-600" />{" "}
                                <span className="text-emerald-600">Activate User</span>
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}