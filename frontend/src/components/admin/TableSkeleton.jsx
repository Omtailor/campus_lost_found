function TableSkeleton() {
  return (
    <tbody className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <tr key={i} className="border-b border-gray-100">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
            <td key={j} className="px-3 py-4">
              {j === 1 ? (
                <div className="w-12 h-12 rounded-lg bg-gray-200" />
              ) : (
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export default TableSkeleton
