import { supabase } from './supabaseClient';

// 제품 전체 조회
export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
}

// 제품 추가
export async function addProduct(product) {
  const { data, error } = await supabase.from('products').insert([product]);
  if (error) throw error;
  return data;
}

// 랙 전체 조회
export async function fetchRacks() {
  const { data, error } = await supabase.from('racks').select('*');
  if (error) throw error;
  return data;
}

// 랙 추가
export async function addRack(rack) {
  const { data, error } = await supabase.from('racks').insert([rack]);
  if (error) throw error;
  return data;
}

// 카테고리 전체 조회
export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
}

// 카테고리 추가
export async function addCategory(category) {
  const { data, error } = await supabase.from('categories').insert([category]);
  if (error) throw error;
  return data;
}

// 사용자 전체 조회
export async function fetchUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
}

// 사용자 추가
export async function addUser(user) {
  const { data, error } = await supabase.from('users').insert([user]);
  if (error) throw error;
  return data;
} 