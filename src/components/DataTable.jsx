export default function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-4 font-semibold">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id ?? index} className="border-t border-slate-100 transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-1 align-middle text-slate-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
