import { getUserModel } from '../models';
import DatabaseService from '../dbService';
import { UserDocument } from '../types';
import mongoose, { FilterQuery } from 'mongoose';

// Define a User interface for our return types
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  role: 'user' | 'admin';
  accounts: Array<{
    id?: string;
    provider: string;
    providerAccountId: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service for handling user operations
 */
class UserService extends DatabaseService<UserDocument> {
  constructor() {
    const model = getUserModel();
    super(model, 'User');
  }

  /**
   * Get a user by email
   * @param email - User email
   * @returns The user or null if not found
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.findOne({ email: email.toLowerCase() });
      if (!user) return null;
      
      // Remove sensitive information
      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;
      
      return {
        id: userObj._id.toString(),
        name: userObj.name,
        email: userObj.email,
        image: userObj.image,
        emailVerified: userObj.emailVerified,
        role: userObj.role,
        accounts: userObj.accounts?.map((account: any) => ({
          ...account,
          id: account._id?.toString(),
        })),
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   * @param id - User ID
   * @returns The user or null if not found
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.findById(id);
      if (!user) return null;
      
      // Remove sensitive information
      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;
      
      return {
        id: userObj._id.toString(),
        name: userObj.name,
        email: userObj.email,
        image: userObj.image,
        emailVerified: userObj.emailVerified,
        role: userObj.role,
        accounts: userObj.accounts?.map((account: any) => ({
          ...account,
          id: account._id?.toString(),
        })),
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param userData - User data
   * @returns The created user
   */
  async createUser(userData: {
    name: string;
    email: string;
    password?: string;
    image?: string;
    emailVerified?: Date;
    role?: 'user' | 'admin';
  }): Promise<User> {
    try {
      const newUser = await this.create({
        ...userData,
        email: userData.email.toLowerCase(),
      });
      
      // Remove sensitive information
      const userObj = newUser.toObject ? newUser.toObject() : newUser;
      delete userObj.password;
      
      return {
        id: userObj._id.toString(),
        name: userObj.name,
        email: userObj.email,
        image: userObj.image,
        emailVerified: userObj.emailVerified,
        role: userObj.role,
        accounts: [],
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update a user
   * @param id - User ID
   * @param userData - Updated user data
   * @returns The updated user
   */
  async updateUser(
    id: string,
    userData: Partial<{
      name: string;
      email: string;
      password: string;
      image: string;
      emailVerified: Date;
      role: 'user' | 'admin';
    }>
  ): Promise<User | null> {
    try {
      // If email is being updated, ensure it's lowercase
      if (userData.email) {
        userData.email = userData.email.toLowerCase();
      }
      
      const updatedUser = await this.updateById(id, userData);
      if (!updatedUser) return null;
      
      // Remove sensitive information
      const userObj = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
      delete userObj.password;
      
      return {
        id: userObj._id.toString(),
        name: userObj.name,
        email: userObj.email,
        image: userObj.image,
        emailVerified: userObj.emailVerified,
        role: userObj.role,
        accounts: userObj.accounts?.map((account: any) => ({
          ...account,
          id: account._id?.toString(),
        })),
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Add an OAuth account to a user
   * @param userId - User ID
   * @param accountData - OAuth account data
   * @returns The updated user
   */
  async addUserAccount(
    userId: string,
    accountData: {
      provider: string;
      providerAccountId: string;
      access_token?: string;
      refresh_token?: string;
      expires_at?: number;
    }
  ): Promise<User | null> {
    try {
      const user = await this.findById(userId);
      if (!user) return null;
      
      // Add the new account
      user.accounts = user.accounts || [];
      user.accounts.push(accountData);
      
      await user.save();
      
      // Remove sensitive information
      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;
      
      return {
        id: userObj._id.toString(),
        name: userObj.name,
        email: userObj.email,
        image: userObj.image,
        emailVerified: userObj.emailVerified,
        role: userObj.role,
        accounts: userObj.accounts?.map((account: any) => ({
          ...account,
          id: account._id?.toString(),
        })),
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
      };
    } catch (error) {
      console.error('Error adding user account:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const userService = new UserService();
export default userService;
