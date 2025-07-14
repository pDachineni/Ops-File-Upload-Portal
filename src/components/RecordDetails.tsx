
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ArrowLeft, Search, Download, AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const API_HOST = import.meta.env.VITE_API_HOST || "";
const API_RECORDS_ENDPOINT = import.meta.env.VITE_API_RECORDS_ENDPOINT || "/api/file/records";
const PAGE_SIZE = Number(import.meta.env.VITE_RECORDS_PAGE_SIZE) || 10;

interface RecordData {
  rowNumber: number;
  primaryKey: string;
  fieldA: string;
  fieldB: string;
  fieldC: string;
  status: 'success' | 'error' | 'warning';
  errorMessage?: string;
}

interface JobDetails {
  jobId: string;
  fileName: string;
  totalRecords: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  processedAt: string;
  uploadedBy: string;
}

const mockJobDetails: JobDetails = {
  jobId: 'job_abc123def',
  fileName: 'quarterly-accounts.xlsx',
  totalRecords: 1247,
  successCount: 1200,
  errorCount: 35,
  warningCount: 12,
  processedAt: '2025-01-04 10:35 AM',
  uploadedBy: 'john@example.com'
};

const mockRecords: RecordData[] = [
  {
    rowNumber: 1,
    primaryKey: 'ACC-001',
    fieldA: 'John Smith',
    fieldB: 'Sales',
    fieldC: '50000',
    status: 'success'
  },
  {
    rowNumber: 2,
    primaryKey: 'ACC-002',
    fieldA: 'Jane Doe',
    fieldB: 'Marketing',
    fieldC: '55000',
    status: 'success'
  },
  {
    rowNumber: 3,
    primaryKey: 'ACC-003',
    fieldA: '',
    fieldB: 'Engineering',
    fieldC: '75000',
    status: 'error',
    errorMessage: 'Name field is required'
  },
  {
    rowNumber: 4,
    primaryKey: 'ACC-004',
    fieldA: 'Bob Johnson',
    fieldB: 'Sales',
    fieldC: 'invalid',
    status: 'error',
    errorMessage: 'Salary must be a valid number'
  },
  {
    rowNumber: 5,
    primaryKey: 'ACC-005',
    fieldA: 'Alice Brown',
    fieldB: 'HR',
    fieldC: '48000',
    status: 'warning',
    errorMessage: 'Salary below minimum threshold'
  }
];

export function RecordDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [records, setRecords] = useState<RecordData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append("jobId", jobId);
    params.append("page", String(page));
    params.append("limit", String(PAGE_SIZE));
    if (filterStatus !== "all") params.append("status", filterStatus);

    fetch(`${API_HOST}${API_RECORDS_ENDPOINT}?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text() || "Failed to fetch records");
        return res.json();
      })
      .then((data) => {
        // Expecting data: { jobDetails: JobDetails, records: RecordData[], total: number }
        if (!data || !Array.isArray(data.records) || data.records.length === 0) {
          setJobDetails(mockJobDetails);
          setRecords(mockRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
          setTotalPages(Math.ceil(mockRecords.length / PAGE_SIZE));
        } else {
          setJobDetails(data.jobDetails || mockJobDetails);
          setRecords(data.records);
          setTotalPages(Math.ceil((data.total || PAGE_SIZE) / PAGE_SIZE));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch records");
        setJobDetails(mockJobDetails);
        setRecords(mockRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
        setTotalPages(Math.ceil(mockRecords.length / PAGE_SIZE));
        setLoading(false);
      });
  }, [jobId, page, filterStatus]);

  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.primaryKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.fieldA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.fieldB.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExportErrors = () => {
    const errorRecords = records.filter(r => r.status === 'error');
    console.log('Exporting error records:', errorRecords);
    // TODO: Implement CSV export
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/status')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to File Status
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details: {jobDetails?.fileName || ""}</CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{jobDetails?.totalRecords ?? 0}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{jobDetails?.successCount ?? 0}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{jobDetails?.errorCount ?? 0}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{jobDetails?.warningCount ?? 0}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              <span>Job ID: {jobDetails?.jobId}</span> • 
              <span> Processed: {jobDetails?.processedAt}</span> • 
              <span> By: {jobDetails?.uploadedBy}</span>
            </div>
            <Button variant="outline" onClick={handleExportErrors}>
              <Download className="h-4 w-4 mr-2" />
              Export Errors
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Record Details</span>
            <div className="flex items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="success">Success Only</option>
                <option value="error">Errors Only</option>
                <option value="warning">Warnings Only</option>
              </select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row #</TableHead>
                  <TableHead>Primary Key</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Error Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow 
                    key={record.rowNumber} 
                    className={`hover:bg-muted/50 ${
                      record.status === 'error' ? 'bg-red-50' : 
                      record.status === 'warning' ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <TableCell className="font-mono text-sm">{record.rowNumber}</TableCell>
                    <TableCell className="font-medium">{record.primaryKey}</TableCell>
                    <TableCell>{record.fieldA || <span className="text-gray-400 italic">empty</span>}</TableCell>
                    <TableCell>{record.fieldB}</TableCell>
                    <TableCell>{record.fieldC}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        {getStatusBadge(record.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-red-600">
                      {record.errorMessage || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No records match your search criteria.</p>
            </div>
          )}
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
        </CardContent>
      </Card>
    </div>
  );
}
