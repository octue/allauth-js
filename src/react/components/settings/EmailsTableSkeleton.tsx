export const EmailsTableSkeleton: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Email addresses
          </h1>
          <p className="w-1/3 sm:w-1/2 xlg:w-full mt-2 text-sm text-gray-700">
            Email addresses linked to your account. Add or remove addresses, or
            request verification from this table.
          </p>
          <div className="mt-4 h-9 w-28 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mt-8 flow-root ">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Verification status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                    <div className="flex items-center">
                      <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
                      <div className="ml-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </div>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <div className="flex justify-end gap-6">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
