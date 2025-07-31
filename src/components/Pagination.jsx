// components/Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center mt-4 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border text-sm flex items-center gap-1 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md text-sm border ${
            page === currentPage
              ? "bg-violet-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border text-sm flex items-center gap-1 disabled:opacity-50"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
