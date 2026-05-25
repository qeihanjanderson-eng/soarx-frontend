'use client';

import { useMemo, useState } from 'react';

import Chat from '@/components/Chat';
import FileUpload from '@/components/FileUpload';
import WorkbookSelector from '@/components/WorkbookSelector';
import SheetSelector from '@/components/SheetSelector';
import ActionButtons from '@/components/ActionButtons';
import ResultsPanel from '@/components/ResultsPanel';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6">
        <header className="mx-auto w-full max-w-3xl">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/70">SoarX Copilot</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Finance chat assistant</h1>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 lg:hidden"
            >
              Tools
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          <main className="relative flex min-h-[calc(100vh-6rem)] flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-soarx-glow">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/75">AI Assistant</p>
                <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                  Ask SoarX for finance insights
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-white/70">
                  Upload workbooks, ask questions, and generate reports from one modern chat interface.
                </p>
              </div>
            </div>

            {statusMessage ? (
              <div className="border-b border-white/10 bg-slate-950/90 px-6 py-4">
                <p className="text-sm text-cyan-100">{statusMessage}</p>
              </div>
            ) : null}

            <div className="flex-1 overflow-hidden">
              <Chat messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </main>

          <aside
            className={`fixed inset-y-0 right-0 z-40 w-full max-w-xs border-l border-white/10 bg-slate-950/98 p-5 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Workspace tools</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Files & actions</h3>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
              >
                Close
              </button>
            </div>

            <div className="space-y-5">
              <FileUpload
                onFileSelected={handleFileSelected}
                isLoading={isLoading}
                uploadedFiles={uploadedFiles}
              />

              <WorkbookSelector selected={selectedWorkbook} onSelect={handleWorkbookSelect} />

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
            </div>
          </aside>

          {sidebarOpen ? (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
