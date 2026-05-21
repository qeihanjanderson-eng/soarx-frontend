'use client';

import { useMemo, useState } from 'react';

import Chat from '@/components/Chat';
import FileUpload from '@/components/FileUpload';
import WorkbookSelector from '@/components/WorkbookSelector';
import SheetSelector from '@/components/SheetSelector';
import ActionButtons from '@/components/ActionButtons';
import ResultsPanel from '@/components/ResultsPanel';
import NavBar from '@/components/NavBar';
import ClientWrapper from '@/components/ClientWrapper';
import { sendMessageToReason, uploadFile, generateWordReport } from '@/utils/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Result {
  fieldsUpdated: string[];
  sheetsModified: string[];
  extractedValues: Record<string, string>;
  reportPath?: string;
}

const DEFAULT_SHEETS: Record<string, string[]> = {
  'Master Excel Proto': ['Fin_Inputs_Entity1', 'Fin_Inputs_Entity2', 'Valuation'],
  'Personal Finance Intelligence Engine': ['Income', 'Assets', 'Liabilities'],
  'Pricing Model Valuation': ['Inputs', 'Outputs', 'Analysis'],
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedWorkbook, setSelectedWorkbook] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const sheets = useMemo(
    () => (selectedWorkbook ? DEFAULT_SHEETS[selectedWorkbook] ?? [] : []),
    [selectedWorkbook]
  );

  const appendMessage = (message: Message) => {
    setMessages((current) => [...current, message]);
  };

  const handleSendMessage = async (text: string) => {
    setStatusMessage('');
    setIsLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    appendMessage(userMessage);

    try {
      const response = await sendMessageToReason(text);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer || 'Received a response from SoarX.',
        timestamp: new Date(),
      };

      appendMessage(assistantMessage);
      setResult({
        fieldsUpdated: response.fields_updated ?? [],
        sheetsModified: [response.sheet_used ?? selectedSheet].filter(Boolean),
        extractedValues: {},
        reportPath: response.report_path ?? undefined,
      });
    } catch (error) {
      setStatusMessage('Unable to reach the backend. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelected = async (file: File) => {
    setStatusMessage('');
    setIsLoading(true);

    try {
      await uploadFile(file);
      setUploadedFiles((current) => [...current, file.name]);
      setStatusMessage(`${file.name} uploaded successfully.`);
    } catch (error) {
      setStatusMessage('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkbookSelect = (workbook: string) => {
    setSelectedWorkbook(workbook);
    setSelectedSheet('');
    setResult(null);
  };

  const handleSheetSelect = (sheet: string) => {
    setSelectedSheet(sheet);
    setResult(null);
  };

  const handleFillExcel = async () => {
    if (!selectedWorkbook || !selectedSheet) {
      setStatusMessage('Please select a workbook and sheet first.');
      return;
    }

    await handleSendMessage(
      `Fill the workbook '${selectedWorkbook}' on sheet '${selectedSheet}'.`
    );
  };

  const handleAnalyzeClient = async () => {
    await handleSendMessage('Analyze the uploaded client data and provide next steps.');
  };

  const handleGenerateReport = async () => {
    setStatusMessage('Generating a report...');
    setIsLoading(true);

    try {
      const response = await generateWordReport('default-client', ['Summary', 'Recommendations']);
      setResult((current) => ({
        ...(current ?? {
          fieldsUpdated: [],
          sheetsModified: [],
          extractedValues: {},
          reportPath: undefined,
        }),
        reportPath: response.path,
      }));
      setStatusMessage('Report generated successfully.');
    } catch (error) {
      setStatusMessage('Report generation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-soarx-navy via-soarx-deep-gray to-soarx-navy relative z-10">
      <NavBar />

      <ClientWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr] gap-4 p-4">
          <Chat
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />

          <div className="space-y-4">
            <FileUpload
              onFileSelected={handleFileSelected}
              isLoading={isLoading}
              uploadedFiles={uploadedFiles}
            />

            <WorkbookSelector
              selected={selectedWorkbook}
              onSelect={handleWorkbookSelect}
            />

            <SheetSelector
              sheets={sheets}
              selected={selectedSheet}
              onSelect={handleSheetSelect}
              disabled={!selectedWorkbook}
            />

            <ActionButtons
              onFillExcel={handleFillExcel}
              onAnalyzeClient={handleAnalyzeClient}
              onGenerateReport={handleGenerateReport}
              isLoading={isLoading}
            />

            <ResultsPanel result={result} isVisible={!!result} />

            {statusMessage ? (
              <div className="rounded-lg border border-soarx-silver/20 bg-soarx-navy/80 p-3 text-sm text-soarx-silver">
                {statusMessage}
              </div>
            ) : null}
          </div>
        </div>
      </ClientWrapper>
    </div>
  );
}
