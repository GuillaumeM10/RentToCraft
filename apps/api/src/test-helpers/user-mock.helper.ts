import { type UserDto, UserRole, type UserUpdateDto } from '@rent-to-craft/dtos';

import { type UserEntity } from '../user/entities/user.entity';

/**
 *
 */
export function createMockUser(overrides: Partial<UserDto> = {}): UserDto {
  return {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword', // eslint-disable-line sonarjs/no-hardcoded-credentials
    firstName: 'John',
    lastName: 'Doe',
    description: null,
    address: null,
    phone: null,
    contactEmail: null,
    role: UserRole.user,
    isPublic: true,
    posts: null,
    postComments: null,
    banner: null,
    profilePicture: null,
    city: null,
    rentals: null,
    rentalComments: null,
    cart: null,
    orders: null,
    ...overrides,
  };
}

/**
 *
 */
export function createMockUserEntity(overrides: Partial<UserEntity> = {}): UserEntity {
  return {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword', // eslint-disable-line sonarjs/no-hardcoded-credentials
    firstName: 'John',
    lastName: 'Doe',
    description: null,
    address: null,
    phone: null,
    contactEmail: null,
    role: UserRole.user,
    isPublic: true,
    posts: null,
    postComments: null,
    banner: null,
    profilePicture: null,
    city: null,
    rentals: null,
    rentalComments: null,
    cart: null,
    orders: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  } as UserEntity;
}

/**
 *
 */
export function createMockUserUpdateDto(overrides: Partial<UserUpdateDto> = {}): UserUpdateDto {
  const baseUser = createMockUser();
  return {
    ...baseUser,
    password: '',
    ...overrides,
  } as UserUpdateDto;
}
