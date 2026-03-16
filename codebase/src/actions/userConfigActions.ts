"use server";
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

interface SaveConfigParams {
  userId: string;
  configData: string;
}

/**
 * Server Action to save user config data to a temporary file and return the file path
 */
export async function saveUserConfig({ userId, configData }: SaveConfigParams): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    if (!userId || !configData) {
      throw new Error('userId and configData are required');
    }

    // Define a temp directory for configs
    const isDev = process.env.NODE_ENV !== 'production';
    const tempDir = isDev
      ? path.join(process.cwd(), 'tmp', 'user-configs')
      : path.join(os.tmpdir(), 'user-configs');

    await fs.mkdir(tempDir, { recursive: true });
    const filePath = path.join(tempDir, `user-config-${userId}.json`);
    
    await fs.writeFile(filePath, configData, 'utf-8');
    return { success: true, filePath };
  } catch (error) {
    console.error('Error saving user config:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save config' };
  }
}
