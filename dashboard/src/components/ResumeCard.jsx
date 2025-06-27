import React from 'react';
import { FileText, Download, Edit, Eye, Trash2, Calendar } from 'lucide-react';

const ResumeCard = ({ resume, onEdit, onDelete, onDownload, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">{resume.name}</h3>
            <p className="text-sm text-gray-500">{resume.type}</p>
          </div>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(resume.status)}`}>
          {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{resume.description}</p>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          Last updated: {new Date(resume.lastModified).toLocaleDateString()}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Used in {resume.applicationsCount} applications
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView && onView(resume)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit && onEdit(resume)}
            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDownload && onDownload(resume)}
            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(resume.id)}
            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;