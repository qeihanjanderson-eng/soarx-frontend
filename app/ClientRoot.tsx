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

export default function ClientRoot() {
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
    <div className="app-shell min-h-screen text-white">
      <NavBar />

      <ClientWrapper>
        <div className="app-content mx-auto max-w-[1600px]">
          <aside className="sidebar glass-panel flex flex-col gap-6 p-5">
            <div className="sidebar-header">
              <div>
                <p className="section-label">Workspace</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  SoarX Finance Copilot
                </h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-cyan-200">
                Copilot
              </div>
            </div>

            <div className="sidebar-section space-y-4">
              <div className="sidebar-item">
                <span className="sidebar-icon">📤</span>
                Upload Files
              </div>
              <FileUpload
                onFileSelected={handleFileSelected}
                isLoading={isLoading}
                uploadedFiles={uploadedFiles}
              />
            </div>

            <div className="sidebar-section space-y-4">
              <div className="sidebar-item">
                <span className="sidebar-icon">📘</span>
                Workbook
              </div>
              <WorkbookSelector
                selected={selectedWorkbook}
                onSelect={handleWorkbookSelect}
              />
            </div>

            <div className="sidebar-section space-y-4">
              <div className="sidebar-item">
                <span className="sidebar-icon">🗂️</span>
                Sheet
              </div>
              <SheetSelector
                sheets={sheets}
                selected={selectedSheet}
                onSelect={handleSheetSelect}
                disabled={!selectedWorkbook}
              />
            </div>

            <div className="sidebar-section space-y-4">
              <div className="sidebar-item">
                <span className="sidebar-icon">⚡</span>
                Actions
              </div>
              <ActionButtons
                onFillExcel={handleFillExcel}
                onAnalyzeClient={handleAnalyzeClient}
                onGenerateReport={handleGenerateReport}
                isLoading={isLoading}
              />
            </div>
          </aside>

          <main className="chat-area glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soarx-glow backdrop-blur-3xl">
            <div className="chat-header border-b border-white/10 px-6 py-5">
              <div>
                <p className="section-label">AI Assistant</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Ask SoarX for finance insights
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/70">
                  Use the finance Copilot to analyze workbooks, upload client files, and generate advisory reports.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-cyan-200">
                Live mode
              </div>
            </div>

            {statusMessage ? (
              <div className="mx-6 mt-4 rounded-3xl border border-cyan-300/10 bg-cyan-500/10 px-5 py-3 text-sm text-cyan-100">
                {statusMessage}
              </div>
            ) : null}

            <div className="flex-1 overflow-hidden">
              <Chat messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>

            <div className="border-t border-white/10 p-4">
              <ResultsPanel result={result} isVisible={!!result} />
            </div>
          </main>
        </div>
      </ClientWrapper>
    </div>
  );
}
