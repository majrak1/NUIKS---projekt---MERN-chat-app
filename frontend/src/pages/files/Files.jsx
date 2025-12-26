import React from 'react'
import useGetFiles from '../../hooks/useGetFiles';
import { useState } from 'react';

import FilePreview from '../../components/files/FilePreview';
import File from '../../components/files/File';
import FileChat from '../../components/files/FileChat';

import useUploadFile from '../../hooks/useUploadFile';

const Files = () => {
    const { loading, files } = useGetFiles();
    const [selectedFileId, setSelectedFileId] = useState(null);

    const [file, setFile] = useState(null);
    const { uploadFile, uploading } = useUploadFile();

    const handleUpload = async () => {
        await uploadFile(file);
    };


    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <a
                        href="/"
                        className="text-gray-300 hover:text-white cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </a>
                </div>
                <h2 className="text-xl font-semibold text-gray-100">Files</h2>

            </div>

            <div>
                <div className="mb-4">
                    <label className="cursor-pointer inline-flex flex-col items-center px-4 py-2 bg-accent text-white rounded-md shadow hover:bg-accent/80 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v-6m0 6v-6m0 6H8.5m3.5 0h3.5M12 3v3m6 18H6a2 2 0 01-2-2V7a2 2 0 012-2h5l2-2h5a2 2 0 012 2v13a2 2 0 01-2 2z" />
                        </svg>
                        <span>Select a document</span>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        <button onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </label>
                </div>
            </div>

            {/* Files list */}
            <div className="py-2 flex flex-col overflow-auto chat-scroll" style={{ width: '50vw', maxWidth: '50vw', minWidth: '50vw' }}>
                <div className="grid grid-cols-6 gap-1">
                    {files.map((file, idx) => (
                        <div
                            key={idx}
                            className={`cursor-pointer h-[150px] flex items-center justify-center rounded-lg border border-black/20 ${selectedFileId === file._id ? "bg-accent/20" : "bg-base-200"}`}
                            onClick={() => setSelectedFileId(file._id)}
                        >
                            <span className="truncate text-gray-200 text-xs text-center px-1">
                                {file.filename}
                            </span>
                        </div>
                    ))}
                    {loading ? (
                        <span className="loading loading-spinner mx-auto col-span-full"></span>
                    ) : null}
                </div>
            </div>

            {/* Show FilePreview if a file is selected */}
            <div style={{
                position: "fixed",
                top: 0,
                right: 0,
                height: "100vh",
                width: "50vw",
                background: "rgba(20,20,30,0.98)",
                zIndex: 50,
                boxShadow: "0 0 20px 4px #111"
            }}>
                {selectedFileId && (
                    <div>
                        <FilePreview fileId={selectedFileId} />
                        {/* <FileChat /> */}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Files