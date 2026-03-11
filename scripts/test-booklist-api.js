#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split(/\r?\n/)

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex <= 0) continue
      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim()
      if (key && process.env[key] === undefined) process.env[key] = value
    }
  } catch (error) {
    console.warn('[booklist-test] 无法加载环境变量文件:', error.message)
  }
}

async function fetchJson(url) {
  const response = await fetch(url)
  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }
  return { response, payload }
}

function printSummary(label, payload) {
  const archive = Array.isArray(payload?.bookList?.archive) ? payload.bookList.archive : []
  const books = Array.isArray(payload?.bookList?.books) ? payload.bookList.books : []
  const shelfNames = archive.map(item => String(item?.name || '').trim()).filter(Boolean)

  console.log(`\n[${label}]`)
  console.log('source:', payload?.source || 'unknown')
  console.log('persisted:', Boolean(payload?.persisted))
  console.log('refreshed:', Boolean(payload?.refreshed))
  console.log('archiveCount:', archive.length)
  console.log('bookCount:', books.length)
  console.log('shelfNames:', shelfNames.join(' | ') || '(empty)')

  const invalidShelfNameBooks = books.filter(book => !String(book?.shelfName || '').trim())
  console.log('booksWithEmptyShelfName:', invalidShelfNameBooks.length)

  if (invalidShelfNameBooks.length) {
    console.log('emptyShelfNameBookIds:', invalidShelfNameBooks.slice(0, 20).map(book => book?.bookId).join(', '))
  }
}

async function run() {
  loadEnvFile(path.join(__dirname, '..', '.env.local'))

  const baseUrl = process.env.BOOKLIST_TEST_BASE_URL || 'http://localhost:3000'
  const targets = [
    { label: 'booklist-debug', url: `${baseUrl}/api/booklist?debug=true` },
    { label: 'about-books', url: `${baseUrl}/api/about/books` }
  ]

  console.log('[booklist-test] baseUrl =', baseUrl)

  for (const target of targets) {
    const { response, payload } = await fetchJson(target.url)
    console.log(`\nRequest: ${target.url}`)
    console.log('Status:', response.status)

    if (!response.ok) {
      console.log('Response:', JSON.stringify(payload, null, 2))
      continue
    }

    printSummary(target.label, payload)
  }
}

run().catch(error => {
  console.error('[booklist-test] 测试失败:', error)
  process.exitCode = 1
})
