export interface Member {
  id: string
  name: string
  verificationStatus: string
  emailAddress: string
  mobileNumber: string
  domain: string
  dateTimeCreated: string
  dateTimeLastActive: string
  status: string
}

export interface MemberEdge {
  node: Member
}

export interface PageInfo {
  hasNextPage: boolean
  endCursor: string | null
}

export interface MembersResponse {
  members: {
    edges: MemberEdge[]
    pageInfo: PageInfo
  }
}

export interface MemberFilterInput {
  name?: string
  emailAddress?: string
  mobileNumber?: string
}

export interface MembersQueryVariables {
  first?: number
  after?: string | null
  filter?: MemberFilterInput
}
