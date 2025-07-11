/**
 * This script updates the version in package.json, creates tag and commits change
 * @usage
 * `bun bump.ts <versionOrRelease> [identifier]`
 * `bun bump.ts 1.2.3`
 * `bun bump.ts patch`
 * `bun bump.ts minor`
 * `bun bump.ts major`
 * `bun bump.ts prerelease alpha`
 * `bun bump.ts prerelease beta`
 * `bun bump.ts prerelease rc`
 */
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { valid, inc } from 'semver-ts'

const versionOrRelease: string | undefined = process.argv[2]
const identifier: string | undefined = process.argv[3]

try {
  execSync('bun run checkall', { stdio: 'inherit' })
} catch (error) {
  console.error('Prettier, eslint, type check, or test has failed:', error)
  process.exit(1)
}

const gitStatus = execSync('git status --porcelain').toString()
if (gitStatus) {
  console.error(
    'Error: Working directory is not clean. Please commit or stash changes first.',
  )
  process.exit(1)
}

if (!versionOrRelease) {
  console.error('Error: No version number or release type provided.')
  process.exit(1)
}

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
] as const

type ReleaseType = (typeof RELEASE_TYPES)[number]

function isValidReleaseType(release: string): release is ReleaseType {
  return RELEASE_TYPES.includes(release as ReleaseType)
}

try {
  const packageJsonPath = './package.json'
  const originalContent = readFileSync(packageJsonPath, 'utf8')
  const hasFinalNewline = originalContent.endsWith('\n')

  const packageJson = JSON.parse(originalContent)
  const oldVersion = packageJson.version

  let version: string
  if (valid(versionOrRelease)) {
    version = versionOrRelease
  } else if (!isValidReleaseType(versionOrRelease)) {
    throw new Error('Invalid version number or release type.')
  } else {
    const _version = identifier
      ? inc(oldVersion, versionOrRelease, identifier)
      : inc(oldVersion, versionOrRelease)
    if (!_version) {
      throw new Error('Invalid version number, release type, or identifier.')
    }
    version = _version
  }

  packageJson.version = version

  let updatedContent = JSON.stringify(packageJson, null, 2)
  if (hasFinalNewline) {
    updatedContent += '\n'
  }

  writeFileSync(packageJsonPath, updatedContent, 'utf8')
  console.log(
    `Updated version from v${oldVersion} to ${version} in package.json`,
  )

  execSync('git add package.json')
  console.log('Staged package.json')

  execSync(`git commit -m "chore: bump version to v${version}"`)
  console.log(`Committed with message: "chore: bump version to v${version}"`)

  execSync(`git tag -a v${version} -m "chore: bump version to v${version}"`)
  console.log(`Created tag: v${version}`)

  execSync('git push --follow-tags')
  console.log('Pushed commits and tags to remote repository')

  console.log(
    `Version bumped from v${oldVersion} to v${version} and pushed successfully.`,
  )
} catch (error) {
  console.error('An error occurred:')
  if (error instanceof Error) {
    console.error(error.message)
  }
  process.exit(1)
}
