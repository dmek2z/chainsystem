"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchProducts, fetchRacks, fetchCategories, fetchUsers } from '@/lib/api';

// Types
export interface Product {
  id: string
  code: string
  inboundDate: string
  outboundDate: string | null
  weight: number
  manufacturer: string
  floor?: number
}

export interface Rack {
  id: string
  name: string
  products: Product[]
  capacity: number
  line: string
}

export interface ProductCode {
  id: string
  code: string
  name: string
  description: string
  category: string
  storageTemp: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  createdAt: string
}

interface StorageContextType {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  racks: Rack[]
  setRacks: React.Dispatch<React.SetStateAction<Rack[]>>
  productCodes: ProductCode[]
  setProductCodes: React.Dispatch<React.SetStateAction<ProductCode[]>>
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  users: any[]
  setUsers: React.Dispatch<React.SetStateAction<any[]>>
  isLoading: boolean
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

interface StorageProviderProps {
  children: React.ReactNode
}

export function StorageProvider({ children }: StorageProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [productCodes, setProductCodes] = useState<ProductCode[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        setIsLoading(true);
        const [productsData, racksData, categoriesData, usersData] = await Promise.all([
          fetchProducts().catch(() => []),
          fetchRacks().catch(() => []),
          fetchCategories().catch(() => []),
          fetchUsers().catch(() => []),
        ]);

        // 데이터 유효성 검사 및 기본값 설정
        setProducts(Array.isArray(productsData) ? productsData : []);
        setRacks(Array.isArray(racksData) ? racksData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        
        // productCodes는 초기에 빈 배열로 설정
        setProductCodes([]);
      } catch (error) {
        console.error('Error loading data:', error);
        // 에러 발생 시 모든 상태를 빈 배열로 초기화
        setProducts([]);
        setRacks([]);
        setCategories([]);
        setUsers([]);
        setProductCodes([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadAll();
  }, []);

  return (
    <StorageContext.Provider value={{ 
      products, 
      setProducts, 
      racks, 
      setRacks, 
      productCodes, 
      setProductCodes, 
      categories, 
      setCategories, 
      users, 
      setUsers, 
      isLoading 
    }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}
