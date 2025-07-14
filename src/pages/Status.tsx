
import { FileStatus } from "@/components/FileStatus";

const Status = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">File Status</h1>
        <p className="text-muted-foreground">
          View the status of your uploaded files and manage your upload history.
        </p>
      </div>
      <FileStatus />
    </div>
  );
};

export default Status;
