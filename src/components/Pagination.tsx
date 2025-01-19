interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Previous
      </button>
      <span className="px-4 py-2 border rounded bg-gray-100">{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Next
      </button>
    </div>
  )
}
