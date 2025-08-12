import {
  type CreateRentalDto,
  type RentalCatDto,
  type RentalCommentDto,
  type RentalDto,
} from "@rent-to-craft/dtos";

import api from "./api.service";
import AppService from "./app.service";

type RentalServiceType = {
  getOne: (rentalId: number | string) => Promise<RentalDto | null>;
  getAll: () => Promise<RentalDto[]>;
  getAllByUser: (userId: number | undefined) => Promise<RentalDto[]>;
  create: (
    rentalData: Partial<CreateRentalDto>,
    images?: File[],
  ) => Promise<RentalDto>;
  update: (
    rentalData: Partial<CreateRentalDto>,
    rentalId: number,
  ) => Promise<RentalDto>;
  remove: (rentalId: number) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  uploadFile: (rentalId: number, files: File[]) => Promise<RentalDto>;

  createCategory: (categoryData: RentalCatDto) => Promise<RentalCatDto>;
  updateCategory: (
    categoryId: string,
    categoryData: RentalCatDto,
  ) => Promise<RentalCatDto>;
  deleteCategory: (categoryId: string) => Promise<void>;
  getOneCategory: (categoryId: string) => Promise<RentalCatDto | null>;
  getAllCategories: () => Promise<RentalCatDto[]>;

  createComment: (
    commentData: Partial<RentalCommentDto>,
  ) => Promise<RentalCommentDto>;
  getCommentsByRental: (rentalId: number) => Promise<RentalCommentDto[]>;
  removeComment: (commentId: number) => Promise<void>;
};
const RentalService: RentalServiceType = {
  getOne: async (rentalId: number | string) => {
    const response = await api.get(`/rental/slug/${rentalId}`);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get(`/rental`);
    return response.data;
  },
  getAllByUser: async (userId: number | undefined) => {
    if (userId) {
      const response = await api.get(`/rental/user/${userId}`);
      return response.data;
    } else {
      const response = await api.get(`/rental/me`);
      return response.data;
    }
  },
  create: async (rentalData, images?) => {
    const formData = AppService.objectToFormData(
      rentalData as unknown as Record<string, unknown>,
    );
    if (images && images.length > 0) {
      images.forEach((image) => formData.append("images", image));
    }
    const response = await api.post(`/rental`, formData);
    return response.data;
  },
  update: async (rentalData, rentalId) => {
    const response = await api.put(`/rental/${rentalId}`, rentalData);
    return response.data;
  },
  remove: async (rentalId: number) => {
    await api.delete(`/rental/${rentalId}`);
  },
  removeFile: async (fileId: string) => {
    const response = await api.delete(`/rental/file/${fileId}`);
    return response.data;
  },
  uploadFile: async (rentalId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const response = await api.put(`/rental/file/${rentalId}`, formData);
    return response.data;
  },

  createCategory: async (categoryData: RentalCatDto) => {
    const response = await api.post(`/rental-cat`, categoryData);
    return response.data;
  },
  updateCategory: async (categoryId: string, categoryData: RentalCatDto) => {
    const response = await api.put(`/rental-cat/${categoryId}`, categoryData);
    return response.data;
  },
  deleteCategory: async (categoryId: string) => {
    const response = await api.delete(`/rental-cat/${categoryId}`);
    return response.data;
  },
  getOneCategory: async (categoryId: string) => {
    const response = await api.get(`/rental-cat/${categoryId}`);
    return response.data;
  },
  getAllCategories: async () => {
    const response = await api.get(`/rental-cat`);
    return response.data;
  },
  createComment: async (commentData: Partial<RentalCommentDto>) => {
    const response = await api.post(`/rental-comment`, commentData);
    return response.data;
  },
  getCommentsByRental: async (rentalId: number) => {
    const response = await api.get(`/rental-comment/${rentalId}`);
    return response.data;
  },
  removeComment: async (commentId: number) => {
    const response = await api.delete(`/rental-comment/${commentId}`);
    return response.data;
  },
};
export default RentalService;
