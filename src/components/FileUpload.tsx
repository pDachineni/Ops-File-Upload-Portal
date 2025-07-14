
import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

const FILE_DEFINITIONS = {
  report: {
    columns: [
      { key: "Name", type: "string" },
      { key: "Amount", type: "number" },
      { key: "Date", type: "date" },
    ],
  },
  // Add more file types as needed
  // invoice: { columns: [...] },
};

async function validateFile(file: File, fileType: string) {
  const definition = FILE_DEFINITIONS[fileType];
  if (!definition) return { valid: false, errors: ["Unknown file type."] };

  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  // Check columns
  const fileColumns = Object.keys(json[0] || {});
  const expectedColumns = definition.columns.map(col => col.key);
  const missingColumns = expectedColumns.filter(col => !fileColumns.includes(col));
  if (missingColumns.length > 0) {
    return { valid: false, errors: [`Missing columns: ${missingColumns.join(", ")}`] };
  }

  // Check data types, limit to 10 errors
  const errors: string[] = [];
  let totalErrors = 0;
  for (let rowIndex = 0; rowIndex < json.length; rowIndex++) {
    const row = json[rowIndex];
    for (const col of definition.columns) {
      const value = row[col.key];
      if (col.type === "number" && isNaN(Number(value))) {
        totalErrors++;
        if (errors.length < 10) {
          errors.push(`Row ${rowIndex + 2}: "${col.key}" should be a number.`);
        }
      }
      if (col.type === "date" && isNaN(Date.parse(value))) {
        totalErrors++;
        if (errors.length < 10) {
          errors.push(`Row ${rowIndex + 2}: "${col.key}" should be a date.`);
        }
      }
      if (col.type === "string" && typeof value !== "string") {
        totalErrors++;
        if (errors.length < 10) {
          errors.push(`Row ${rowIndex + 2}: "${col.key}" should be a string.`);
        }
      }
      if (errors.length >= 10) break;
    }
    if (errors.length >= 10) break;
  }

  if (totalErrors >= 10) {
    errors.push("Only the first 10 errors are displayed out of many.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true, errors: [] };
}

interface FileUploadStatus {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string[];
}

export function FileUpload() {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const FILE_TYPES = [
  { value: "report", label: "Report" }               
  ];

  const [fileType, setFileType] = useState(FILE_TYPES[0].value);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setRejectedFiles(rejectedFiles);
    setUploadStatus([]);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const validation = await validateFile(file, fileType);
      if (!validation.valid) {
        setAcceptedFiles([]);
        setUploadStatus([{
          fileName: file.name,
          progress: 0,
          status: 'error',
          // error: validation.errors.join("\n"),
          error: validation.errors,          
        }]);
      } else {
        setAcceptedFiles([file]);
        setUploadStatus([]);
      }
    } else {
      setAcceptedFiles([]);
    }
  }, [fileType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxSize: 25 * 1024 * 1024, // 25MB
  });

  const removeFile = (index: number) => {
    setAcceptedFiles((files) => files.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setAcceptedFiles([]);
    setRejectedFiles([]);
    setUploadStatus([]);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadStatus([{
      fileName: acceptedFiles[0].name,
      progress: 0,
      status: 'uploading',
    }]);

    // Simulate file upload
    // Replace this with actual upload logic      
    const uploadPromises = acceptedFiles.map((file, index) => {
      return new Promise<void>((resolve) => {
        const fakeUpload = (progress: number) => {
          setUploadStatus((prevStatus) => {
            const newStatus = [...prevStatus];
            newStatus[index] = {
              fileName: file.name,
              progress: progress,
              status: 'uploading',
            };
            return newStatus;
          });

          if (progress < 100) {
            setTimeout(() => {
              fakeUpload(progress + 10);
            }, 200);
          } else {
            setUploadStatus((prevStatus) => {
              const newStatus = [...prevStatus];
              newStatus[index] = {
                fileName: file.name,
                progress: 100,
                status: 'completed',
              };
              return newStatus;
            });
            resolve();
          }
        };

        fakeUpload(0);
      });
    });

    Promise.all(uploadPromises)
      .then(() => {
        toast({
          title: "Upload Complete",
          description: "All files have been successfully uploaded.",
        })
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "There was an error during the upload process.",
        })
        setUploadStatus((prevStatus) => {
          return prevStatus.map((status) => ({
            ...status,
            status: 'error',
            error: ['Upload failed'],
          }));
        });
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <div className="space-y-6">
      <Card>
        {/* <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6" />
            Upload Excel Files
          </CardTitle>
        </CardHeader> */}
        <CardContent className="p-6">

          {/* File Type Selector */}
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="file-type" className="text-sm font-medium text-gray-700">File that you would like to upload:</label>
            <select
              id="file-type"
              value={fileType}
              onChange={e => setFileType(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              disabled={isUploading}
            >
              {FILE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Dropzone Area */}
          <div
            {...getRootProps()}
            className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : acceptedFiles.length > 0
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            
            {acceptedFiles.length === 0 ? (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive ? 'Drop Excel files here' : 'Upload Excel Files'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Drag & drop Excel files (.xlsx, .xls) or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Maximum file size: 25 MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                <div>
                  <p className="text-lg font-medium text-green-900">
                    {acceptedFiles.length} Excel file(s) ready
                  </p>
                  <p className="text-sm text-gray-500">
                    Click upload to process your files
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* File List */}
          {acceptedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-gray-900">Selected Files:</h4>
              {acceptedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Error Messages */}
          {rejectedFiles.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-medium text-red-800">Invalid Files:</h4>
              </div>
              {rejectedFiles.map((rejection, index) => (
                <div key={index} className="text-sm text-red-700">
                  <p className="font-medium">{rejection.file.name}</p>
                  <ul className="list-disc list-inside ml-4">
                    {rejection.errors.map((error, errorIndex) => (
                      <li key={errorIndex}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {uploadStatus.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-gray-900">Upload Progress:</h4>
              {uploadStatus.map((status, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{status.fileName}</span>
                    <Badge variant={
                      status.status === 'completed' ? 'default' :
                      status.status === 'error' ? 'destructive' : 'secondary'
                    }>
                      {status.status === 'uploading' ? 'Uploading...' :
                       status.status === 'completed' ? 'Completed' : 'Error'}
                    </Badge>
                  </div>
                  <Progress value={status.progress} className="h-2" />
                  {status.error && Array.isArray(status.error) && (
                    <ul className="text-sm text-red-600 list-disc list-inside">
                      {status.error.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleUpload}
              disabled={acceptedFiles.length === 0 || isUploading}
              className="flex-1"
            >
              {isUploading ? 'Uploading...' : `Upload ${acceptedFiles.length} File(s)`}
            </Button>
            {acceptedFiles.length > 0 && (
              <Button
                variant="outline"
                onClick={clearFiles}
                disabled={isUploading}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
