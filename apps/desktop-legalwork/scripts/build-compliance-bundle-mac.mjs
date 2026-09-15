#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { createReadStream, existsSync } from 'node:fs'
import { cp, mkdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const projectDir = resolve(dirname(new URL(import.meta.url).pathname), '..')
const defaultVersion = '0.3.31'
const bosBase = 'https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0'

function parseArgs(argv) {
  const result = { version: defaultVersion }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === '--arch') result.arch = argv[++index]
    else if (value === '--version') result.version = argv[++index]
    else if (value === '--output') result.output = argv[++index]
    else throw new Error(`Unknown argument: ${value}`)
  }
  if (!['arm64', 'x64'].includes(result.arch)) {
    throw new Error('Usage: node scripts/build-compliance-bundle-mac.mjs --arch arm64|x64 [--version 0.3.31] [--output DIR]')
  }
  if (!/^\d+\.\d+\.\d+$/.test(result.version)) {
    throw new Error(`Invalid bundle version: ${result.version}`)
  }
  return result
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || projectDir,
    env: options.env || process.env,
    stdio: 'inherit',
    encoding: 'utf8'
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`)
  }
}

function targetCommand(arch, python, args) {
  if (arch === 'x64' && process.arch === 'arm64') {
    return ['/usr/bin/arch', ['-x86_64', python, ...args]]
  }
  return [python, args]
}

function runPython(arch, python, args, options = {}) {
  const [command, commandArgs] = targetCommand(arch, python, args)
  run(command, commandArgs, options)
}

async function sha256(filePath) {
  const hash = createHash('sha256')
  await new Promise((resolvePromise, reject) => {
    const stream = createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('error', reject)
    stream.on('end', resolvePromise)
  })
  return hash.digest('hex')
}

async function download(url, destination) {
  await mkdir(dirname(destination), { recursive: true })
  run('/usr/bin/curl', ['-fL', '--retry', '3', '--retry-delay', '2', '-o', destination, url])
}

async function prepareModels(arch, bundleRoot, workRoot) {
  const modelRoot = join(bundleRoot, 'paddle-models')
  await mkdir(modelRoot, { recursive: true })
  if (arch === 'arm64') {
    const sourceRoot = join(projectDir, 'vendor', 'ocr-runtime', 'paddle-models')
    const modelNames = [
      'PP-LCNet_x1_0_doc_ori',
      'UVDoc',
      'PP-LCNet_x1_0_textline_ori',
      'PP-OCRv6_medium_det',
      'PP-OCRv6_medium_rec'
    ]
    for (const modelName of modelNames) {
      const source = join(sourceRoot, modelName)
      if (!existsSync(source)) throw new Error(`Missing bundled model: ${source}`)
      await cp(source, join(modelRoot, modelName), { recursive: true, dereference: false })
    }
    return
  }

  const models = [
    ['PP-OCRv4_mobile_det', 'PP-OCRv4_mobile_det_infer.tar'],
    ['PP-OCRv4_mobile_rec', 'PP-OCRv4_mobile_rec_infer.tar']
  ]
  const downloadRoot = join(workRoot, 'model-downloads')
  await mkdir(downloadRoot, { recursive: true })
  for (const [modelName, archiveName] of models) {
    const archivePath = join(downloadRoot, archiveName)
    const extractedName = archiveName.replace(/\.tar$/, '')
    const extractedPath = join(downloadRoot, extractedName)
    await download(`${bosBase}/${archiveName}`, archivePath)
    run('/usr/bin/tar', ['-xf', archivePath, '-C', downloadRoot])
    if (!existsSync(extractedPath)) throw new Error(`Model archive did not contain ${extractedName}`)
    await rename(extractedPath, join(modelRoot, modelName))
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const machine = `mac-${args.arch}`
  const outputRoot = resolve(
    args.output || join(projectDir, '.tmp-compliance-bundle-mac', `release-v${args.version}`, machine)
  )
  const bundleRoot = join(outputRoot, 'bundle')
  const archivePath = join(
    outputRoot,
    `legalwork-compliance-env-${machine}-v${args.version}.tar.gz`
  )
  const sourcePython = join(projectDir, 'vendor', 'office-runtime', machine, 'python')
  const python = join(bundleRoot, 'python', 'bin', 'python3')
  const requirements = join(
    projectDir,
    'vendor',
    'data-compliance-review-codex',
    'data-compliance-web',
    'requirements.txt'
  )

  if (!existsSync(sourcePython)) throw new Error(`Missing Office runtime: ${sourcePython}`)
  if (!existsSync(requirements)) throw new Error(`Missing compliance requirements: ${requirements}`)

  await rm(outputRoot, { recursive: true, force: true })
  await mkdir(bundleRoot, { recursive: true })
  console.log(`[compliance-bundle] Copying relocatable Python for ${machine}`)
  run('/bin/cp', ['-R', '-P', sourcePython, join(bundleRoot, 'python')])

  const pythonEnv = {
    ...process.env,
    PYTHONHOME: join(bundleRoot, 'python')
  }

  const constraints = [
    args.arch === 'arm64' ? 'paddlepaddle==3.3.1' : 'paddlepaddle==3.0.0',
    'paddleocr==3.7.0',
    'paddlex==3.7.2',
    ...(args.arch === 'x64' ? ['cryptography==48.0.0'] : [])
  ].join('\n') + '\n'
  const constraintsPath = join(outputRoot, 'constraints.txt')
  await writeFile(constraintsPath, constraints, 'utf8')

  console.log(`[compliance-bundle] Installing Python dependencies for ${machine}`)
  runPython(args.arch, python, [
    '-m',
    'pip',
    'install',
    '--disable-pip-version-check',
    '--no-input',
    '-r',
    requirements,
    '-c',
    constraintsPath
  ], { env: pythonEnv })

  console.log(`[compliance-bundle] Preparing OCR models for ${machine}`)
  await prepareModels(args.arch, bundleRoot, outputRoot)

  runPython(args.arch, python, [
    '-c',
    [
      'import platform',
      'import paddle',
      'import paddleocr',
      'import paddlex',
      "print('machine=' + platform.machine())",
      "print('paddle=' + paddle.__version__)",
      "print('paddleocr=' + paddleocr.__version__)",
      "print('paddlex=' + paddlex.__version__)"
    ].join(';')
  ], { env: pythonEnv })

  console.log(`[compliance-bundle] Creating ${archivePath}`)
  run('/usr/bin/tar', ['-czf', archivePath, '-C', bundleRoot, 'python', 'paddle-models'])
  const archiveStat = await stat(archivePath)
  const digest = await sha256(archivePath)
  const manifest = {
    version: args.version,
    machine,
    archive: archivePath,
    bytes: archiveStat.size,
    sha256: digest,
    cosKey: `legalwork/compliance/env/${machine}/legalwork-compliance-env-${machine}-v${args.version}.tar.gz`
  }
  await writeFile(join(outputRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8')
  console.log(JSON.stringify(manifest, null, 2))
}

main().catch((error) => {
  console.error(`[compliance-bundle] ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
