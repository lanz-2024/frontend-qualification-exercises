import MembersTable from '@/components/MembersTable'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ScaleForge Members Management
        </h1>
        <p className="text-gray-600">
          Frontend qualification exercise - Members management application
        </p>
      </div>
      
      <MembersTable />
    </main>
  )
}
