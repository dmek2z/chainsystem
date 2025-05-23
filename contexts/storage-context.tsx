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
  floor?: number // 층 정보 추가
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

export function StorageProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [racks, setRacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      setIsLoading(true);
      const [productsData, racksData, categoriesData, usersData] = await Promise.all([
        fetchProducts(),
        fetchRacks(),
        fetchCategories(),
        fetchUsers(),
      ]);
      setProducts(productsData);
      setRacks(racksData);
      setCategories(categoriesData);
      setUsers(usersData);
      setIsLoading(false);
    }
    loadAll();
  }, []);

  return (
    <StorageContext.Provider value={{ products, setProducts, racks, setRacks, categories, setCategories, users, setUsers, isLoading }}>
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
