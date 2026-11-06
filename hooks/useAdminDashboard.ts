import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import {
  AdminDashboardStats,
  UserGrowthData,
  SectorComplianceData,
  AdminActivity,
  VerificationRequest,
} from "@/types/admin";

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [sectorCompliance, setSectorCompliance] = useState<SectorComplianceData[]>([]);
  const [recentActivities, setRecentActivities] = useState<AdminActivity[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [statsData, growthData, sectorData, activitiesData, verificationsData] =
          await Promise.all([
            adminApi.getDashboardStats(),
            adminApi.getUserGrowth(6),
            adminApi.getSectorCompliance(),
            adminApi.getAuditLogs(1, 5),
            adminApi.getPendingVerifications(),
          ]);

        setStats(statsData);
        setUserGrowth(growthData);
        setSectorCompliance(sectorData);
        setRecentActivities(activitiesData.data || []);
        setPendingVerifications(verificationsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  return {
    stats,
    userGrowth,
    sectorCompliance,
    recentActivities,
    pendingVerifications,
    loading,
    error,
  };
}