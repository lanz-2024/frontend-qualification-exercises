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
      <div className="bg-red-50 border border-red-200 rounded-xs p-4 shadow-sf-lg">
        <h3 className="text-red-800 font-medium">Error loading members</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sf-background-primary text-white">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Search Controls */}
        <div className="sf-table p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value, searchType)}
                className="sf-input w-full px-4 py-2 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <select
                value={searchType}
                onChange={(e) => handleSearch(searchTerm, e.target.value as any)}
                className="sf-dropdown px-4 py-2 text-white bg-sf-background-primary"
                style={{ width: 'auto', minWidth: '150px' }}
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
        <div className="sf-table overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sf-border-primary">
              <thead className="bg-sf-background-primary border-b border-sf-border-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="bg-sf-background-primary divide-y divide-sf-border-primary">
                {loading && allMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                      </div>
                      <p className="mt-2 text-gray-400">Loading members...</p>
                    </td>
                  </tr>
                ) : allMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                      No members found
                    </td>
                  </tr>
                ) : (
                  allMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-opacity-80 hover:bg-sf-border-primary transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{member.name}</div>
                        <div className="text-sm text-gray-400">ID: {member.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{member.emailAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{member.mobileNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{member.domain}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`sf-badge inline-flex px-3 py-1 text-xs font-semibold rounded-xs ${
                          member.status === 'active'
                            ? 'bg-green-900 text-green-300 border border-green-700'
                            : 'bg-gray-800 text-gray-300 border border-gray-600'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`sf-badge inline-flex px-3 py-1 text-xs font-semibold rounded-xs ${
                          member.verificationStatus === 'verified'
                            ? 'bg-blue-900 text-blue-300 border border-blue-700'
                            : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                        }`}>
                          {member.verificationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatDate(member.dateTimeCreated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
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
              <div className="bg-sf-background-primary px-6 py-3 border-t border-sf-border-primary">
                <div className="flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="sf-button inline-flex items-center px-6 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="text-sm text-gray-400 text-center">
            Showing {allMembers.length} members
            {data?.members?.pageInfo?.hasNextPage && ' (more available)'}
          </div>
        </div>
      </div>
    )
}
