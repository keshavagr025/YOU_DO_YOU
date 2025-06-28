import React, { useState } from 'react';

export default function ResumeTracker() {
  const [resumes, setResumes] = useState([
    {
      id: 1,
      company: 'Google',
      position: 'Frontend Developer',
      date: '2025-05-01',
      status: 'Reviewed',
    },
    {
      id: 2,
      company: 'Amazon',
      position: 'Backend Engineer',
      date: '2025-05-10',
      status: 'Interview',
    },
    {
      id: 3,
      company: 'Microsoft',
      position: 'Full Stack Developer',
      date: '2025-05-15',
      status: 'Rejected',
    },
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Reviewed':
        return 'text-blue-600 bg-blue-100';
      case 'Interview':
        return 'text-green-600 bg-green-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Resume Tracker</h2>
      <p className="text-gray-700 mb-6">Track all your submitted resumes and statuses here.</p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 rounded">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="py-2 px-4 border-b">Company</th>
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">Applied Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{resume.company}</td>
                <td className="py-2 px-4 border-b">{resume.position}</td>
                <td className="py-2 px-4 border-b">{resume.date}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(resume.status)}`}>
                    {resume.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
