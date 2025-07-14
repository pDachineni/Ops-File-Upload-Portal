import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, RotateCcw, Trash2, Eye, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_HOST = import.meta.env.VITE_API_HOST || "";
const API_STATUS_ENDPOINT = import.meta.env.VITE_API_STATUS_ENDPOINT || "/api/file/status";

interface FileRecord {
  id: string;
  fileName: string;
  recordCount: number;
  jobId: string;
  dateUploaded: string;
  processingStatus: 'uploading' | 'processing' | 'processed' | 'upload-failed' | 'process-failed';
  uploadedBy: string;
  fileSize: string;
  errorMessage?: string;
}

const mockFiles: FileRecord[] = [
  {
    id: '1',
    fileName: 'quarterly-accounts.xlsx',
    recordCount: 1247,
    jobId: 'job_abc123def',
    dateUploaded: '2025-01-04 10:30 AM',
    processingStatus: 'processed',
    uploadedBy: 'john@example.com',
    fileSize: '2.4 MB'
  },
  {
    id: '2',
    fileName: 'customer-data.xlsx',
    recordCount: 5680,
    jobId: 'job_xyz789uvw',
    dateUploaded: '2025-01-04 09:15 AM',
    processingStatus: 'processed',
    uploadedBy: 'sarah@example.com',
    fileSize: '8.7 MB'
  },
  {
    id: '3',
    fileName: 'inventory-report.xlsx',
    recordCount: 0,
    jobId: 'job_def456ghi',
    dateUploaded: '2025-01-04 08:45 AM',
    processingStatus: 'upload-failed',
    uploadedBy: 'mike@example.com',
    fileSize: '45.2 MB',
    errorMessage: 'File size exceeds 25MB limit'
  },
  {
    id: '4',
    fileName: 'employee-roster.xlsx',
    recordCount: 342,
    jobId: 'job_ghi123jkl',
    dateUploaded: '2025-01-03 04:20 PM',
    processingStatus: 'processing',
    uploadedBy: 'admin@example.com',
    fileSize: '1.1 MB'
  },
  {
    id: '5',
    fileName: 'sales-data.xlsx',
    recordCount: 890,
    jobId: 'job_mno456pqr',
    dateUploaded: '2025-01-03 02:15 PM',
    processingStatus: 'process-failed',
    uploadedBy: 'jane@example.com',
    fileSize: '3.2 MB',
    errorMessage: 'Validation failed on 45 records due to missing required fields'
  },
  {
    id: '6',
    fileName: 'marketing-campaigns.xlsx',
    recordCount: 1200,
    jobId: 'job_stu789vwx',
    dateUploaded: '2025-01-02 11:00 AM',
    processingStatus: 'uploading',
    uploadedBy: '',
    fileSize: '2.8 MB'
  },
  { id: '7',
    fileName: 'financial-statements.xlsx',
    recordCount: 0,
    jobId: 'job_yza123bcd',
    dateUploaded: '2025-01-02 09:30 AM',
    processingStatus: 'upload-failed',
    uploadedBy: ''  ,
    fileSize: '10.5 MB',
    errorMessage: 'File format not supported'
  },
  {
    id: '8',
    fileName: 'project-timeline.xlsx',
    recordCount: 450,
    jobId: 'job_efg456hij',
    dateUploaded: '2025-01-01 03:00 PM',
    processingStatus: 'processed',
    uploadedBy: '',
    fileSize: '1.5 MB',
    errorMessage: 'Some records had warnings'
  },
  { id: '9',
    fileName: 'budget-forecast.xlsx', 

    recordCount: 0,
    jobId: 'job_klm789nop',
    dateUploaded: '2025-01-01 01:45 PM',
    processingStatus: 'upload-failed',
    uploadedBy: '',
    fileSize: '4.3 MB',
    errorMessage: 'File is empty'
  },
  { id: '10',
    fileName: 'vendor-list.xlsx', 
    recordCount: 320,
    jobId: 'job_qrs123tuv',
    dateUploaded: '2025-01-01 11:20 AM',
    processingStatus: 'processed',
    uploadedBy: '',
    fileSize: '2.0 MB'
  },

  { id: '11',
    fileName: 'vendor-list.xlsx', 
    recordCount: 320,
    jobId: 'job_qqrs123tuv',
    dateUploaded: '2025-01-01 11:20 AM',
    processingStatus: 'processed',
    uploadedBy: '',
    fileSize: '2.0 MB'
  }  
];

export function FileStatus() {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch paginated data from API
  useEffect(() => {
    setLoading(true);
    setError(null);

    setFiles(mockFiles.slice((page - 1) * 10, page * 10));
    setTotalPages(Math.ceil(mockFiles.length / 10));
    setLoading(false);    


    // Uncomment below to fetch from API
    // fetch(`${API_HOST}${API_STATUS_ENDPOINT}?page=${page}&limit=10`)
    //   .then(async (res) => {
    //     if (!res.ok) {
    //       throw new Error(await res.text() || "Failed to fetch file status");
    //     }
    //     return res.json();
    //   })
    //   .then((data) => {
    //     // Expecting data: { files: FileRecord[], total: number }
    //     if (!data || !Array.isArray(data.files) || data.files.length === 0) {
    //       setFiles(mockFiles.slice((page - 1) * 10, page * 10));
    //       setTotalPages(Math.ceil(mockFiles.length / 10));
    //     } else {
    //       setFiles(data.files);
    //       setTotalPages(Math.ceil((data.total || 10) / 10));
    //     }
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setError(err.message || "Failed to fetch file status");
    //     setFiles(mockFiles.slice((page - 1) * 10, page * 10));
    //     setTotalPages(Math.ceil(mockFiles.length / 10));
    //     setLoading(false);
    //   });
  }, [page]);

  const filteredFiles = files.filter(file =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string, errorMessage?: string) => {
    const getBadgeProps = () => {
      switch (status) {
        case 'processed':
          return { 
            className: "bg-green-100 text-green-800 hover:bg-green-100",
            text: "Processed"
          };
        case 'upload-failed':
          return { 
            variant: "destructive" as const,
            text: "Upload Failed"
          };
        case 'process-failed':
          return { 
            variant: "destructive" as const,
            text: "Process Failed"
          };
        case 'processing':
          return { 
            className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
            text: "Processing"
          };
        case 'uploading':
          return { 
            className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
            text: "Uploading"
          };
        default:
          return { 
            variant: "outline" as const,
            text: status
          };
      }
    };

    const badgeProps = getBadgeProps();
    return (
      <div className="flex items-center gap-2">
        <Badge {...badgeProps}>{badgeProps.text}</Badge>
        {errorMessage && (
          <span 
            className="text-xs text-red-600 cursor-help" 
            title={errorMessage}
          >
            ⚠️
          </span>
        )}
      </div>
    );
  };

  const handleViewRecords = (jobId: string) => {
    navigate(`/jobs/${jobId}/records`);
  };

  const handleRetryJob = (jobId: string) => {
    console.log('Retrying job:', jobId);
    // TODO: Implement retry logic
  };

  const handleDeleteJob = (jobId: string) => {
    console.log('Deleting job:', jobId);
    // TODO: Implement delete logic
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No files found</h3>
      <p className="text-muted-foreground">
        {searchTerm ? 'Try adjusting your search terms' : 'Start by uploading some Excel files!'}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>File Processing History</span>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by file name, job ID, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : filteredFiles.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead className="text-right">Record Count</TableHead>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Date Uploaded</TableHead>
                      <TableHead>Processing Status</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{file.fileName}</span>
                            <span className="text-xs text-muted-foreground">{file.fileSize}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {file.recordCount > 0 ? file.recordCount.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleViewRecords(file.jobId)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-sm"
                          >
                            {file.jobId}
                          </button>
                        </TableCell>
                        <TableCell className="text-sm">{file.dateUploaded}</TableCell>
                        <TableCell>
                          {getStatusBadge(file.processingStatus, file.errorMessage)}
                        </TableCell>
                        <TableCell className="text-sm">{file.uploadedBy}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {file.processingStatus === 'processed' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewRecords(file.jobId)}
                                title="View record details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {file.processingStatus === 'process-failed' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewRecords(file.jobId)}
                                title="View error details"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            {(file.processingStatus === 'upload-failed' || file.processingStatus === 'process-failed') && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRetryJob(file.jobId)}
                                title="Retry processing"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteJob(file.jobId)}
                              title="Delete job"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
