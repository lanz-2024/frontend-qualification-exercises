'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_MEMBERS, GET_MEMBERS_BY_NAME, GET_MEMBERS_BY_EMAIL, GET_MEMBERS_BY_MOBILE } from '@/lib/queries'
import { Member, MembersResponse, MemberFilterInput } from '@/types/member'

const ITEMS_PER_PAGE = 10

export default function MembersTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'name' | 'email' | 'mobile'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [allMembers, setAllMembers] = useState<Member[]>([])

  // Determine which query to use based on search type
  const getQuery = () => {
    switch (searchType) {
      case 'name':
        return GET_MEMBERS_BY_NAME
      case 'email':
        return GET_MEMBERS_BY_EMAIL
      case 'mobile':
        return GET_MEMBERS_BY_MOBILE
      default:
        return GET_MEMBERS
    }
  }

  // Build filter object based on search
  const getFilter = (): MemberFilterInput => {
    if (!searchTerm) return {}
    
    switch (searchType) {
      case 'name':
        return { name: searchTerm }
      case 'email':
        return { emailAddress: searchTerm }
      case 'mobile':
        return { mobileNumber: searchTerm }
      default:
        return {}
    }
  }

  const { data, loading, error, fetchMore } = useQuery<MembersResponse>(getQuery(), {
    variables: {
      first: ITEMS_PER_PAGE,
      after: null,
      filter: getFilter(),
    },
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    if (data?.members?.edges) {
      setAllMembers(data.members.edges.map(edge => edge.node))
    }
  }, [data])

  const handleSearch = (term: string, type: 'all' | 'name' | 'email' | 'mobile') => {
    setSearchTerm(term)
    setSearchType(type)
    setCurrentPage(1)
    setAllMembers([])
  }

  const handleLoadMore = () => {
    if (data?.members?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: data.members.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          
          const newEdges = fetchMoreResult.members.edges
          const updatedMembers = [...allMembers, ...newEdges.map(edge => edge.node)]
          setAllMembers(updatedMembers)
          
          return {
            members: {
              ...fetchMoreResult.members,
              edges: [...prev.members.edges, ...newEdges],
            },
          }
        },
      })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error loading members</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value, searchType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={searchType}
              onChange={(e) => handleSearch(searchTerm, e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Fields</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && allMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Loading members...</p>
                  </td>
                </tr>
              ) : allMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No members found
                  </td>
                </tr>
              ) : (
                allMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">ID: {member.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.emailAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.mobileNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.domain}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.verificationStatus === 'verified' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(member.dateTimeCreated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(member.dateTimeLastActive)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.members?.pageInfo?.hasNextPage && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500 text-center">
        Showing {allMembers.length} members
        {data?.members?.pageInfo?.hasNextPage && ' (more available)'}
      </div>
    </div>
  )
}
