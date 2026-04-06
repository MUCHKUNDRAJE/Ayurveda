import { useState, useRef, useCallback } from "react";
import axios from "axios";
import Footer from "@/components/shared/Footer";

const ACCEPTED = [".xlsx", ".xls", ".csv"];
const ACCEPTED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
];

function FileStackIcon() {
  return (
    <div className="relative w-24 h-28 mx-auto mb-6">
      {/* Back page */}
      <div className="absolute top-2 left-0 w-16 h-20 bg-gray-200 rounded-xl -rotate-6" />
      {/* Front page */}
      <div className="absolute top-0 left-6 w-16 h-20 bg-gray-100 rounded-xl shadow-md flex items-end justify-start p-2">
        <div className="w-7 h-7 bg-gray-500 rounded-md flex items-center justify-center">
          <span className="text-white text-xs font-bold tracking-tighter">X</span>
        </div>
      </div>
    </div>
  );
}

function FileRow({ file, onRemove }) {
  const ext = file.name.split(".").pop().toUpperCase();
  const size =
    file.size < 1024
      ? file.size + " B"
      : file.size < 1024 * 1024
      ? Math.round(file.size / 1024) + " KB"
      : (file.size / 1024 / 1024).toFixed(1) + " MB";

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
      <div className="w-9 h-9 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center shrink-0">
        <span className="text-green-700 text-xs font-bold">{ext}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
        <p className="text-xs text-gray-400">{size}</p>
      </div>
      <button
        onClick={() => onRemove(file.name)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 2l10 10M12 2L2 12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [message, setMessage] = useState(null);
  const inputRef = useRef(null);
  const Base_URL = import.meta.env.VITE_BACKEND_API_URL;

  const validate = (f) =>
    ACCEPTED.some((ext) => f.name.toLowerCase().endsWith(ext)) ||
    ACCEPTED_MIME.includes(f.type);

  const addFiles = useCallback((incoming) => {
    setError("");
    const valid = [];
    const invalid = [];
    Array.from(incoming).forEach((f) => {
      if (validate(f)) valid.push(f);
      else invalid.push(f.name);
    });
    if (invalid.length) setError(`Unsupported file(s): ${invalid.join(", ")}`);
    if (valid.length)
      setFiles((prev) => {
        const names = new Set(prev.map((f) => f.name));
        return [...prev, ...valid.filter((f) => !names.has(f.name))];
      });
  }, []);

  const removeFile = (name) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file); // Ensure the key is correct according to the backend
    });

    

    try {
      const response = await axios.post(`${Base_URL}/api/csv/upload`, formData, {
       
      });

      if (response.status === 200) {
        setUploading(false);
        setUploaded(true);
        setMessage(response.data);
      }
    } catch (err) {
      setUploading(false);
      console.error("Upload error:", err);

      if (err.response) {
        const { status, data } = err.response;
        const msg = data?.message || "Failed to upload file(s).";

        if (status === 400) {
          setError(`Bad Request (400): ${msg}`);
          setMessage(response.data);
          
        } else if (status === 500) {
          setError("Server Error (500): There was a problem on the server side.");
          
        } else {
          setError(`Error (${status}): ${msg}`);
             
        }
      } else {
        setError("Network error. Please check your connection to the server.");
      }
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUploaded(false);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
    <div className="  bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md mb-50">

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
          File Upload
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Upload your spreadsheet or CSV to store data in the database.
        </p>

        {/* Drop zone */}
        <div
          onClick={() => !uploaded && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            bg-white  rounded-2xl border-2 border-dashed px-8 py-12 text-center
            shadow-sm transition-all duration-200
            ${!uploaded ? "cursor-pointer" : "cursor-default"}
            ${dragging ? "border-sky-400 bg-sky-50" : "border-gray-200 hover:border-gray-300"}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          {uploaded ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M6 14l6 6 10-10"
                    stroke="white"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-lg font-bold text-gray-900">Files Uploaded!</p>
              <p className="text-sm text-gray-500">
                {files.length} file{files.length > 1 ? "s" : ""} stored successfully.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FileStackIcon />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Files</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Drag and drop your files here, or{" "}
                <span className="text-sky-500 font-medium">click to select.</span>
                <br />
                Supported formats: .xsls, .xsl, .csv
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-3 text-xs text-red-500 text-center">{error}</p>
        )}

            {message && (
          <p className="mt-3 text-xs text-green-500 text-center">{message}</p>
        )}

        {/* File list */}
        {files.length > 0 && !uploaded && (
          <div className="mt-4 flex flex-col gap-2">
            {files.map((f) => (
              <FileRow key={f.name} file={f} onRemove={removeFile} />
            ))}
          </div>
        )}

        {/* Upload button */}
        {files.length > 0 && !uploaded && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`
              mt-4 w-full py-3.5 rounded-xl text-sm font-semibold text-white
              bg-gray-900 hover:bg-gray-800 active:scale-[0.98]
              flex items-center justify-center gap-2
              transition-all duration-150
              ${uploading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {uploading ? (
              <>
                <Spinner /> Uploading...
              </>
            ) : (
              `Upload ${files.length} file${files.length > 1 ? "s" : ""}`
            )}
          </button>
        )}

        {/* Reset after success */}
        {uploaded && (
          <button
            onClick={handleReset}
            className="mt-4 w-full py-3.5 rounded-xl text-sm font-semibold text-gray-800 border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all duration-150"
          >
            Upload more files
          </button>
        )}

      </div>
    </div>

    
    
    </>
  );
}