'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export async function createCompany(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  const region = String(formData.get('region') || '').trim()
  if (!name || !region) throw new Error('Name and region are required')

  const company = await prisma.company.create({ data: { name, region } })
  revalidatePath('/')
  revalidatePath('/admin')
  redirect(`/admin/companies/${company.id}/edit`)
}

export async function updateCompany(id: number, formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  const region = String(formData.get('region') || '').trim()
  if (!name || !region) throw new Error('Name and region are required')

  await prisma.company.update({ where: { id }, data: { name, region } })
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/companies/${id}`)
}

export async function deleteCompany(id: number) {
  await prisma.company.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function createProduct(companyId: number, formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  const fdaNumber = String(formData.get('fdaNumber') || '').trim() || null
  const year = formData.get('year') ? Number(formData.get('year')) : null
  const ce = formData.get('ce') === 'on'
  const era = Number(formData.get('era') || 3)
  const notes = String(formData.get('notes') || '').trim() || null

  if (!name) throw new Error('Product name is required')

  await prisma.product.create({ data: { name, fdaNumber, year, ce, era, notes, companyId } })
  revalidatePath('/')
  revalidatePath(`/companies/${companyId}`)
  revalidatePath(`/admin/companies/${companyId}/edit`)
}

export async function updateProduct(id: number, companyId: number, formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  const fdaNumber = String(formData.get('fdaNumber') || '').trim() || null
  const year = formData.get('year') ? Number(formData.get('year')) : null
  const ce = formData.get('ce') === 'on'
  const era = Number(formData.get('era') || 3)
  const notes = String(formData.get('notes') || '').trim() || null

  await prisma.product.update({ where: { id }, data: { name, fdaNumber, year, ce, era, notes } })
  revalidatePath('/')
  revalidatePath(`/companies/${companyId}`)
  revalidatePath(`/admin/companies/${companyId}/edit`)
}

export async function deleteProduct(id: number, companyId: number) {
  await prisma.product.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath(`/companies/${companyId}`)
  revalidatePath(`/admin/companies/${companyId}/edit`)
}
