import React, { useEffect, useRef, useState } from 'react';
import useGetFile from '../../hooks/useGetFile';

const FilePreview = ({ fileId }) => {
    const { loading, file } = useGetFile(fileId);
    const [pdfUrl, setPdfUrl] = useState(null);
    const objectUrlRef = useRef(null);

    useEffect(() => {
        // Clean up the previous object URL
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!file || loading) return;

        // file.data should have .data (Uint8Array/Array buffer) and .contentType, etc.
        // Expect file.data.data as the buffer, and file.data.contentType, or fallback to 'application/pdf'

        // Clean up previous object url
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }

        // Try to retrieve PDF buffer
        const buffer = file?.data?.data
            ? new Uint8Array(file.data.data)
            : null;

        if (
            buffer &&
            (file.data.contentType === 'application/pdf' ||
                file.filename?.toLowerCase()?.endsWith('.pdf'))
        ) {
            const blob = new Blob([buffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            objectUrlRef.current = url;
            setPdfUrl(url);
        } else {
            setPdfUrl(null);
        }
    }, [file, loading]);

    return (
        <div>
            {file?.filename && (
                <div className="mb-2 text-gray-200 font-semibold">{file.filename}</div>
            )}
            {loading && <span className='loading loading-spinner mx-auto'></span>}

            {!loading && pdfUrl && (
                <iframe
                    src={pdfUrl}
                    title={file?.filename || 'PDF Preview'}
                    width="100%"
                    height="800px"
                    style={{ border: 'none', background: '#2a2a2a' }}
                />
            )}

            {!loading && !pdfUrl && (
                <div className="mt-4 text-red-400 text-sm">
                    Cannot preview. This file may not be a PDF.
                </div>
            )}
        </div>
    );
};

export default FilePreview;