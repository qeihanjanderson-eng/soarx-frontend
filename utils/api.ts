'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.soarxtax.com';

interface ReasonResponse {
  answer: string;
  workbook_used: string;
  sheet_used: string;
  fields_updated: string[];
  raw_chunks_used: string[];
  write_confirmation: string | null;
  report_path: string | null;
}

interface UploadFileResponse {
  status: string;
  filename: string;
  chunks_added: number;
  client_folder: string;
}

interface ExportWordResponse {
  status: string;
  path: string;
}

export async function sendMessageToReason(
  text: string,
  onProgress?: (message: string) => void
): Promise<ReasonResponse> {
  try {
    onProgress?.('Sending message to reasoning engine...');

    const response = await fetch(`${API_BASE_URL}/reason`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: ReasonResponse = await response.json();
    onProgress?.('Response received');
    return data;
  } catch (error) {
    console.error('Error sending message to reason:', error);
    throw error;
  }
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadFileResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    onProgress?.(0);

    const response = await fetch(`${API_BASE_URL}/upload_file`, {
      method: 'POST',
      body: formData,
    });

    onProgress?.(100);

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data: UploadFileResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function generateWordReport(
  clientId: string,
  sections: string[]
): Promise<ExportWordResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/export_word`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        sections,
      }),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    const data: ExportWordResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating Word report:', error);
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Error testing connection:', error);
    return false;
  }
}
