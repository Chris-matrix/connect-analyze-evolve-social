import connectDB from './mongodb';
import mongoose from 'mongoose';
import type { Document, Model, FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Generic database service for handling MongoDB operations
 * This service provides a clean interface for common database operations
 */
class DatabaseService<T extends Document> {
  private model: Model<T>;
  private modelName: string;

  /**
   * Create a new DatabaseService instance
   * @param model - Mongoose model to use for operations
   * @param modelName - Name of the model (for logging)
   */
  constructor(model: Model<T>, modelName: string) {
    this.model = model;
    this.modelName = modelName;
  }

  /**
   * Create a new document
   * @param data - Data to create the document with
   * @returns The created document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      await connectDB();
      return await this.model.create(data);
    } catch (error) {
      console.error(`Error creating ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find documents matching a query
   * @param query - Query to match documents against
   * @returns Array of matching documents
   */
  async find(query: FilterQuery<T> = {}): Promise<T[]> {
    try {
      await connectDB();
      return await this.model.find(query).exec();
    } catch (error) {
      console.error(`Error finding ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find a single document by ID
   * @param id - ID of the document to find
   * @returns The found document or null if not found
   */
  async findById(id: string): Promise<T | null> {
    try {
      await connectDB();
      return await this.model.findById(id).exec();
    } catch (error) {
      console.error(`Error finding ${this.modelName} by ID:`, error);
      throw error;
    }
  }

  /**
   * Find a single document matching a query
   * @param query - Query to match the document against
   * @returns The found document or null if not found
   */
  async findOne(query: FilterQuery<T>): Promise<T | null> {
    try {
      await connectDB();
      return await this.model.findOne(query).exec();
    } catch (error) {
      console.error(`Error finding one ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document by ID
   * @param id - ID of the document to update
   * @param data - Data to update the document with
   * @returns The updated document
   */
  async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      await connectDB();
      return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      console.error(`Error updating ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by ID
   * @param id - ID of the document to delete
   * @returns The deleted document
   */
  async deleteById(id: string): Promise<T | null> {
    try {
      await connectDB();
      return await this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error(`Error deleting ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Count documents matching a query
   * @param query - Query to match documents against
   * @returns Number of matching documents
   */
  async count(query: FilterQuery<T> = {}): Promise<number> {
    try {
      await connectDB();
      return await this.model.countDocuments(query).exec();
    } catch (error) {
      console.error(`Error counting ${this.modelName}:`, error);
      throw error;
    }
  }
}

export default DatabaseService;
