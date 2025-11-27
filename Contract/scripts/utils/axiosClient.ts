// utils/axiosClient.ts
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const JAVA_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8085";

// Tạo instance chung để tái sử dụng
const javaApi = axios.create({
  baseURL: JAVA_URL,
  timeout: 30000,
});

// Hàm helper chung – quan trọng nhất!
const requestToJava = async (
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  data: any = {},
  authHeader?: string 
) => {
  try {
    const headers: any = {
      "Content-Type": "application/json",
    };

    // Nếu có token từ frontend → forward sang Java
    if (authHeader && authHeader.startsWith("Bearer ")) {
      headers.Authorization = authHeader;
    }

    const response = await javaApi({
      method,
      url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
      data: method !== "get" ? data : undefined,
      params: method === "get" ? data : undefined,
      headers,
});

    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message;
    console.error(`Lỗi ${method.toUpperCase()} Java /${endpoint}:`, msg);
    throw error; 
  }
};

// Các hàm export – giờ đều hỗ trợ forward token
export const syncToJava = async (endpoint: string, data: any, authHeader?: string) => {
  return await requestToJava("post", endpoint, data, authHeader);
};

export const putToJava = async (endpoint: string, data: any, authHeader?: string) => {
  return await requestToJava("put", endpoint, data, authHeader);
};

export const getFromJava = async (endpoint: string, data: any = {}, authHeader?: string) => {
  return await requestToJava("get", endpoint, data, authHeader);
};

export const deleteFromJava = async (endpoint: string, data: any = {}, authHeader?: string) => {
  return await requestToJava("delete", endpoint, data, authHeader);
};