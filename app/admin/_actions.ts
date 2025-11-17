'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function setRole(formData: FormData) {
  const client = await clerkClient()

  // Check that the user trying to set the role is an admin
  if (!(await checkRole('admin'))) {
    console.error('Not authorized to set role')
    return
  }

  try {
    await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') },
    })
    revalidatePath('/admin/users')
  } catch (err) {
    console.error('Error setting role:', err)
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient()

  // Check that the user trying to remove the role is an admin
  if (!(await checkRole('admin'))) {
    console.error('Not authorized to remove role')
    return
  }

  try {
    await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: null },
    })
    revalidatePath('/admin/users')
  } catch (err) {
    console.error('Error removing role:', err)
  }
}

