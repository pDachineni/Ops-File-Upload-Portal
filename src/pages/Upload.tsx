
import { FileUpload } from "@/components/FileUpload";

const Upload = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Upload Files</h1>
        <p className="text-muted-foreground">
          Drag and drop your files here or click to browse and select files from your computer.
        </p>
      </div>
      <FileUpload />
    </div>
  );
};

export default Upload;
