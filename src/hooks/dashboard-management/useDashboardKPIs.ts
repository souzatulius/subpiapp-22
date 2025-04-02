
import { useState, useEffect } from 'react';

interface KPIsState {
  pressRequests: {
    today: number;
    yesterday: number;
    percentageChange: number;
    loading: boolean;
  };
  pendingApproval: {
    total: number;
    awaitingResponse: number;
    loading: boolean;
  };
  notesProduced: {
    total: number;
    approved: number;
    rejected: number;
    loading: boolean;
  };
}

export const useDashboardKPIs = () => {
  const [kpis, setKpis] = useState<KPIsState>({
    pressRequests: {
      today: 0,
      yesterday: 0,
      percentageChange: 0,
      loading: true,
    },
    pendingApproval: {
      total: 0,
      awaitingResponse: 0,
      loading: true,
    },
    notesProduced: {
      total: 0,
      approved: 0,
      rejected: 0,
      loading: true,
    },
  });

  useEffect(() => {
    // Mock data fetching for the KPIs
    const fetchKPIs = () => {
      setTimeout(() => {
        const pressRequestsToday = Math.floor(Math.random() * 30) + 5;
        const pressRequestsYesterday = Math.floor(Math.random() * 30) + 5;
        
        // Fix the percentage calculation to avoid infinite type instantiation
        let percentageChange = 0;
        if (pressRequestsYesterday > 0) {
          percentageChange = ((pressRequestsToday - pressRequestsYesterday) / pressRequestsYesterday) * 100;
        }

        const pendingApprovalTotal = Math.floor(Math.random() * 20) + 3;
        const awaitingResponse = Math.floor(pendingApprovalTotal * 0.6);

        const notesTotal = Math.floor(Math.random() * 60) + 20;
        const notesApproved = Math.floor(notesTotal * 0.8);
        const notesRejected = notesTotal - notesApproved;

        setKpis({
          pressRequests: {
            today: pressRequestsToday,
            yesterday: pressRequestsYesterday,
            percentageChange,
            loading: false,
          },
          pendingApproval: {
            total: pendingApprovalTotal,
            awaitingResponse,
            loading: false,
          },
          notesProduced: {
            total: notesTotal,
            approved: notesApproved,
            rejected: notesRejected,
            loading: false,
          },
        });
      }, 1000);
    };

    fetchKPIs();
  }, []);

  return { kpis };
};
