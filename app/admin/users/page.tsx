import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { SearchUsers } from '../SearchUsers'
import { clerkClient } from '@clerk/nextjs/server'
import { removeRole, setRole } from '../_actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Shield, UserCog, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ search?: string }>
}) {
  if (!(await checkRole('admin'))) {
    redirect('/')
  }

  const searchParams = await props.searchParams
  const query = searchParams.search

  const client = await clerkClient()
  const users = query ? (await client.users.getUserList({ query })).data : []

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <Badge className="bg-red-600 text-white"><Shield className="w-3 h-3 mr-1" />Admin</Badge>
    }
    if (role === 'moderator') {
      return <Badge className="bg-blue-600 text-white"><UserCog className="w-3 h-3 mr-1" />Moderator</Badge>
    }
    return <Badge variant="secondary" className="bg-gray-200 text-gray-700"><User className="w-3 h-3 mr-1" />User</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-block">
              <Image 
                src="/devfest-london-logo.png" 
                alt="DevFest London 2025" 
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <Badge variant="secondary" className="text-sm bg-red-100 text-red-700">
              <Shield className="w-3 h-3 mr-1" />
              Admin Panel
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              ← Back to Admin Dashboard
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Role Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Search for users by name or email to manage their roles. Changes take effect immediately.
            </p>
            <SearchUsers />

            {query && (
              <div className="mt-6">
                {users.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No users found matching &quot;{query}&quot;</p>
                    <p className="text-sm text-gray-500 mt-2">Try searching with a different name or email</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Found {users.length} user{users.length !== 1 ? 's' : ''}
                    </h3>
                    {users.map((user) => {
                      const currentRole = (user.publicMetadata.role as string) || 'user'
                      
                      return (
                        <Card key={user.id} className="bg-white hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-3 mb-2">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {user.firstName} {user.lastName}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  {getRoleBadge(currentRole)}
                                </div>
                              </div>

                              <div className="flex gap-2 flex-wrap">
                                <form action={setRole}>
                                  <input type="hidden" value={user.id} name="id" />
                                  <input type="hidden" value="admin" name="role" />
                                  <Button 
                                    type="submit" 
                                    variant={currentRole === 'admin' ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={currentRole === 'admin'}
                                    className={currentRole === 'admin' ? 'bg-red-600 hover:bg-red-700' : ''}
                                  >
                                    <Shield className="w-4 h-4 mr-1" />
                                    Make Admin
                                  </Button>
                                </form>

                                <form action={setRole}>
                                  <input type="hidden" value={user.id} name="id" />
                                  <input type="hidden" value="moderator" name="role" />
                                  <Button 
                                    type="submit" 
                                    variant={currentRole === 'moderator' ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={currentRole === 'moderator'}
                                    className={currentRole === 'moderator' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                  >
                                    <UserCog className="w-4 h-4 mr-1" />
                                    Make Moderator
                                  </Button>
                                </form>

                                <form action={removeRole}>
                                  <input type="hidden" value={user.id} name="id" />
                                  <Button 
                                    type="submit" 
                                    variant="outline"
                                    size="sm"
                                    disabled={currentRole === 'user' || !user.publicMetadata.role}
                                  >
                                    Remove Role
                                  </Button>
                                </form>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {!query && (
              <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Role Definitions
                </h4>
                <ul className="space-y-3 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 text-red-600" />
                    <div>
                      <strong>Admin:</strong> Full access - manage submissions, select winners, delete projects, manage user roles
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCog className="w-4 h-4 mt-0.5 text-blue-600" />
                    <div>
                      <strong>Moderator:</strong> View access - can view all submissions but cannot modify them
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <User className="w-4 h-4 mt-0.5 text-gray-600" />
                    <div>
                      <strong>User:</strong> Standard access - can submit their own projects and view public gallery
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

