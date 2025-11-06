import React from 'react'

const File = ({ fileData }) => {
    console.log(fileData)
    return (
        <div className="border border-black/20 rounded-lg p-4 bg-base-200 flex flex-col items-center">
            <span className="font-bold text-gray-200 text-lg">{fileData.filename}</span>
            <span className="text-sm text-gray-400 mt-1">
                {fileData.uploadDate}
            </span>
        </div>
    )
}

export default File