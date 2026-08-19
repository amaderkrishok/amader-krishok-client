import api from '@/lib/axios';
import axios from 'axios';
import { CreateOvijogDTO, Ovijog, OvijogStatus } from '@/types/ovijog';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const ENDPOINT = `${API_URL}/ovijogs`;

const extractData = (resData: any) => {
  if (resData && typeof resData === 'object' && 'data' in resData && 'statusCode' in resData) {
    return resData.data;
  }
  return resData;
};

export const OvijogService = {
  /**
   * Submit an Ovijog / Complaint
   */
  submitOvijog: async (dto: CreateOvijogDTO): Promise<Ovijog> => {
    const response = await axios.post(ENDPOINT, dto);
    return extractData(response.data);
  },

  /**
   * Get all Ovijogs for Admin Dashboard
   */
  getAllForAdmin: async (status?: OvijogStatus): Promise<Ovijog[]> => {
    const url = status ? `${ENDPOINT}/admin?status=${status}` : `${ENDPOINT}/admin`;
    const response = await api.get(url);
    const data = extractData(response.data);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Update Ovijog status (Admin only)
   */
  updateStatus: async (id: number, status: OvijogStatus): Promise<Ovijog> => {
    const response = await api.patch(`${ENDPOINT}/admin/${id}/status`, { status });
    return extractData(response.data);
  },

  /**
   * Delete an Ovijog (Admin only)
   */
  deleteOvijog: async (id: number): Promise<void> => {
    const response = await api.delete(`${ENDPOINT}/admin/${id}`);
    return extractData(response.data);
  },
};
