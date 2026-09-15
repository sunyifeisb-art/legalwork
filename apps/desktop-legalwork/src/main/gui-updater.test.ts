import { EventEmitter } from 'node:events'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type MockUpdater = EventEmitter & {
  autoDownload: boolean
  autoInstallOnAppQuit: boolean
  allowPrerelease: boolean
  forceDevUpdateConfig: boolean
  logger: unknown
  setFeedURL: ReturnType<typeof vi.fn>
  checkForUpdates: ReturnType<typeof vi.fn>
  downloadUpdate: ReturnType<typeof vi.fn>
  quitAndInstall: ReturnType<typeof vi.fn>
}

let updater: MockUpdater
let nativeUpdater: EventEmitter
let mockApp: EventEmitter
let mockExePath: string
let mockUserDataPath: string
let spawnMock: ReturnType<typeof vi.fn>
const ORIGINAL_ENV = { ...process.env }

function createUpdater(): MockUpdater {
  return Object.assign(new EventEmitter(), {
    autoDownload: true,
    autoInstallOnAppQuit: true,
    allowPrerelease: false,
    forceDevUpdateConfig: false,
    logger: null,
    setFeedURL: vi.fn(),
    checkForUpdates: vi.fn(),
    downloadUpdate: vi.fn(),
    quitAndInstall: vi.fn()
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.resetModules()
  process.env = { ...ORIGINAL_ENV }
  delete process.env.LEGALWORK_UPDATE_URL
  delete process.env.LEGALWORK_UPDATE_URL_STABLE
  delete process.env.LEGALWORK_UPDATE_URL_FRONTIER
  delete process.env.LEGALWORK_GITHUB_REPO
  delete process.env.LEGALWORK_UPDATE_CHANNEL
  updater = createUpdater()
  nativeUpdater = new EventEmitter()
  mockExePath = '/tmp/legalwork-updater-test-bin'
  mockUserDataPath = '/tmp/legalwork-updater-test-user-data'
  spawnMock = vi.fn(() => ({ unref: vi.fn() }))
  mockApp = Object.assign(new EventEmitter(), {
    isPackaged: true,
    quit: vi.fn(),
    getName: () => 'legalwork-updater-test',
    getAppPath: () => '/tmp/legalwork-updater-test-app',
    getPath: (name: string) => name === 'exe' ? mockExePath : mockUserDataPath,
    getVersion: () => '0.1.0'
  })
  vi.doMock('electron', () => ({
    app: mockApp,
    autoUpdater: nativeUpdater,
    BrowserWindow: class {}
  }))
  vi.doMock('electron-updater', () => ({
    default: { autoUpdater: updater },
    autoUpdater: updater
  }))
  vi.doMock('node:child_process', () => ({ spawn: spawnMock }))
})

afterEach(() => {
  vi.clearAllTimers()
  vi.restoreAllMocks()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  process.env = { ...ORIGINAL_ENV }
  vi.doUnmock('electron')
  vi.doUnmock('electron-updater')
  vi.doUnmock('node:child_process')
  vi.resetModules()
})

describe('initializeGuiUpdater', () => {
  it('uses GitHub Releases as the packaged update feed when a repository is configured', async () => {
    process.env.LEGALWORK_GITHUB_REPO = 'sunyifeisb-art/legalwork'

    const module = await import('./gui-updater')
    module.initializeGuiUpdater(() => null, () => 'stable')

    expect(updater.setFeedURL).toHaveBeenLastCalledWith({
      provider: 'github',
      owner: 'sunyifeisb-art',
      repo: 'legalwork'
    })
  })

  it('removes the installed pending update package but keeps the macOS differential cache', async () => {
    const fixtureDir = mkdtempSync(join(tmpdir(), 'legalwork-updater-cleanup-test-'))
    const cacheDir = join(fixtureDir, '__update__')
    const pendingDir = join(cacheDir, 'pending')
    const pendingZip = join(pendingDir, 'legalwork-0.1.0-mac-arm64.zip')
    const differentialZip = join(cacheDir, 'update.zip')
    mockUserDataPath = fixtureDir

    try {
      mkdirSync(pendingDir, { recursive: true })
      writeFileSync(pendingZip, 'installed update')
      writeFileSync(
        join(pendingDir, 'update-info.json'),
        JSON.stringify({ fileName: basename(pendingZip), sha512: 'test' }),
        'utf8'
      )
      writeFileSync(differentialZip, 'differential cache')

      const module = await import('./gui-updater')
      module.initializeGuiUpdater(() => null, () => 'stable')

      expect(existsSync(pendingDir)).toBe(false)
      expect(readFileSync(differentialZip, 'utf8')).toBe('differential cache')
    } finally {
      rmSync(fixtureDir, { recursive: true, force: true })
    }
  })

  it('keeps a pending package when it belongs to a newer version', async () => {
    const fixtureDir = mkdtempSync(join(tmpdir(), 'legalwork-updater-pending-test-'))
    const pendingDir = join(fixtureDir, '__update__', 'pending')
    const pendingZip = join(pendingDir, 'legalwork-0.2.0-mac-arm64.zip')
    mockUserDataPath = fixtureDir

    try {
      mkdirSync(pendingDir, { recursive: true })
      writeFileSync(pendingZip, 'future update')
      writeFileSync(
        join(pendingDir, 'update-info.json'),
        JSON.stringify({ fileName: basename(pendingZip), sha512: 'test' }),
        'utf8'
      )

      const module = await import('./gui-updater')
      module.initializeGuiUpdater(() => null, () => 'stable')

      expect(readFileSync(pendingZip, 'utf8')).toBe('future update')
    } finally {
      rmSync(fixtureDir, { recursive: true, force: true })
    }
  })
})

describe('downloadGuiUpdate', () => {
  it('adds user-facing release highlights and filters technical changelog lines', async () => {
    process.env.LEGALWORK_GITHUB_REPO = 'sunyifeisb-art/legalwork'
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        tag_name: 'v0.2.0',
        name: 'LegalWork 0.2.0',
        published_at: '2026-06-06T00:00:00.000Z',
        body: [
          '## 更新内容',
          '- 新增文书写作模板库，起草常用法律文书更方便。',
          '- Bump TypeScript to 5.8',
          '- 修复自动更新安装失败的问题。',
          '- latest-mac.yml metadata refresh'
        ].join('\n')
      })
    })))
    updater.checkForUpdates.mockRejectedValueOnce(new Error('latest-mac.yml is missing'))

    const module = await import('./gui-updater')
    module.initializeGuiUpdater(() => null, () => 'stable')

    const info = await module.checkGuiUpdate('stable')

    expect(info).toMatchObject({
      ok: true,
      latestVersion: '0.2.0',
      releaseHighlights: [
        '新增文书写作模板库，起草常用法律文书更方便。',
        '修复自动更新安装失败的问题。'
      ]
    })
    expect(JSON.stringify(info)).not.toContain('TypeScript')
    expect(JSON.stringify(info)).not.toContain('latest-mac.yml')
  })

  it('strips HTML tags from release highlights before rendering them in settings', async () => {
    process.env.LEGALWORK_GITHUB_REPO = 'sunyifeisb-art/legalwork'
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        tag_name: 'v0.2.7',
        name: 'LegalWork 0.2.7',
        published_at: '2026-07-11T00:00:00.000Z',
        body: [
          '<h2>v0.2.7</h2>',
          '<ul>',
          '<li><strong>自动更新兜底安装</strong>： macOS 在原生 updater 未触发应用退出时，自动通过已下载的 zip 执行 shell 兜底安装，降低更新失败概率。</li>',
          '<li><strong>数据合规批量任务</strong>： 支持一次提交多个文件进行合规审查/脱敏，自动生成 <code>input_manifest.json</code> 并统一调度。</li>',
          '</ul>'
        ].join('\n')
      })
    })))
    updater.checkForUpdates.mockRejectedValueOnce(new Error('latest-mac.yml is missing'))

    const module = await import('./gui-updater')
    module.initializeGuiUpdater(() => null, () => 'stable')

    const info = await module.checkGuiUpdate('stable')

    expect(info).toMatchObject({
      ok: true,
      latestVersion: '0.2.7',
      releaseHighlights: [
        '自动更新兜底安装： macOS 在原生 updater 未触发应用退出时，自动通过已下载的 zip 执行 shell 兜底安装，降低更新失败概率。',
        '数据合规批量任务： 支持一次提交多个文件进行合规审查/脱敏，自动生成 input_manifest.json 并统一调度。'
      ]
    })
    expect(JSON.stringify(info)).not.toContain('<li>')
    expect(JSON.stringify(info)).not.toContain('<strong>')
    expect(JSON.stringify(info)).not.toContain('<code>')
  })

  it('renders release highlights without markdown markers or build metadata', async () => {
    process.env.LEGALWORK_GITHUB_REPO = 'sunyifeisb-art/legalwork'
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        tag_name: 'v0.2.9',
        name: 'LegalWork 0.2.9',
        published_at: '2026-07-14T14:06:10.000Z',
        body: [
          '## v0.2.9',
          '',
          '- **OfficeCLI 集成**：新增 @officecli/officecli 支持，运行时自动注入 officecli MCP server。',
          '- **Agent 附件本地路径引用**：附件支持 `localFilePath`，Agent 可直接引用本地文件路径。',
          '',
          '---',
          '',
          '### 构建信息',
          '',
          '- Release version: `0.2.9`',
          '- Release channel: `stable`',
          '- Base version: `0.2.8`',
          '- Branch: `main`',
          '- Commit: `abc1234`',
          '- macOS: ✅ Developer ID 签名 + 公证'
        ].join('\n')
      })
    })))
    updater.checkForUpdates.mockRejectedValueOnce(new Error('latest-mac.yml is missing'))

    const module = await import('./gui-updater')
    module.initializeGuiUpdater(() => null, () => 'stable')

    const info = await module.checkGuiUpdate('stable')

    expect(info).toMatchObject({
      ok: true,
      latestVersion: '0.2.9',
      releaseHighlights: [
        'OfficeCLI 集成：新增 @officecli/officecli 支持，运行时自动注入 officecli MCP server。',
        'Agent 附件本地路径引用：附件支持 localFilePath，Agent 可直接引用本地文件路径。'
      ]
    })
    expect(JSON.stringify(info)).not.toContain('**')
    expect(JSON.stringify(info)).not.toContain('Release version')
    expect(JSON.stringify(info)).not.toContain('Developer ID')
  })

  it('retries the packaged updater when the previous check only found a manual GitHub fallback', async () => {
    process.env.LEGALWORK_GITHUB_REPO = 'sunyifeisb-art/legalwork'
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        tag_name: 'v0.2.0',
        published_at: '2026-06-06T00:00:00.000Z'
      })
    })))

    updater.checkForUpdates
      .mockRejectedValueOnce(new Error('latest-mac.yml is missing'))
      .mockResolvedValueOnce({
        updateInfo: { version: '0.2.0', releaseDate: '2026-06-06T00:00:00.000Z' },
        isUpdateAvailable: true
      })
    updater.downloadUpdate.mockResolvedValue(['/tmp/legalwork-0.2.0-mac-arm64.zip'])

    const module = await import('./gui-updater')
    module.initializeGuiUpdater(() => null, () => 'stable')

    const fallbackInfo = await module.checkGuiUpdate('stable')
    expect(fallbackInfo).toMatchObject({
      ok: true,
      hasUpdate: true,
      latestVersion: '0.2.0',
      manualOnly: true
    })

    await expect(module.downloadGuiUpdate('stable')).resolves.toEqual({
      ok: true,
      paths: ['/tmp/legalwork-0.2.0-mac-arm64.zip']
    })
    expect(updater.checkForUpdates).toHaveBeenCalledTimes(2)
    expect(updater.downloadUpdate).toHaveBeenCalledTimes(1)
  })
})

describe('installGuiUpdate', () => {
  it('installs a downloaded macOS ZIP directly instead of waiting for Squirrel to download it again', async () => {
    const canRunMacInstaller = process.platform === 'darwin'
    vi.spyOn(process, 'platform', 'get').mockReturnValue('darwin')
    const fixtureDir = mkdtempSync(join(tmpdir(), 'legalwork-updater-test-'))
    const zipPath = join(fixtureDir, 'legalwork-0.2.0-mac-arm64.zip')
    const targetApp = join(fixtureDir, 'installed', 'legalwork.app')
    const updateApp = join(fixtureDir, 'update', 'legalwork.app')
    const executableRelativePath = join('Contents', 'MacOS', 'legalwork')
    const createTestApp = (appPath: string, version: string): void => {
      mkdirSync(join(appPath, 'Contents', 'MacOS'), { recursive: true })
      writeFileSync(
        join(appPath, 'Contents', 'Info.plist'),
        `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>legalwork</string>
<key>CFBundleIdentifier</key><string>com.xingyuzhong.legalwork</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleShortVersionString</key><string>${version}</string>
<key>CFBundleVersion</key><string>${version}</string>
</dict></plist>`,
        'utf8'
      )
      copyFileSync(process.execPath, join(appPath, executableRelativePath))
      chmodSync(join(appPath, executableRelativePath), 0o755)
    }

    createTestApp(targetApp, '0.1.0')
    if (canRunMacInstaller) {
      createTestApp(updateApp, '0.2.0')
      execFileSync('codesign', ['--force', '--deep', '--sign', '-', updateApp])
      execFileSync(
        'ditto',
        ['-c', '-k', '--sequesterRsrc', '--keepParent', basename(updateApp), zipPath],
        { cwd: dirname(updateApp) }
      )
    } else {
      writeFileSync(zipPath, 'test update zip')
    }
    const zipSha512 = createHash('sha512').update(readFileSync(zipPath)).digest('base64')
    mockExePath = join(targetApp, executableRelativePath)
    mockUserDataPath = fixtureDir

    try {
      const module = await import('./gui-updater')
      const beforeQuitAndInstall = vi.fn()
      module.initializeGuiUpdater(
        () => null,
        () => 'stable',
        undefined,
        beforeQuitAndInstall
      )
      updater.emit('update-downloaded', {
        version: '0.2.0',
        releaseDate: '2026-06-06T00:00:00.000Z',
        downloadedFile: zipPath,
        files: [{ url: basename(zipPath), sha512: zipSha512 }]
      })

      await expect(module.installGuiUpdate()).resolves.toEqual({ ok: true })

      expect(beforeQuitAndInstall).toHaveBeenCalledTimes(1)
      expect(spawnMock).toHaveBeenCalledWith(
        '/bin/bash',
        [expect.stringMatching(/install-mac-update\.sh$/)],
        { detached: true, stdio: 'ignore' }
      )
      expect(updater.quitAndInstall).not.toHaveBeenCalled()
      expect((mockApp as typeof mockApp & { quit: ReturnType<typeof vi.fn> }).quit).toHaveBeenCalledTimes(1)

      const scriptPath = spawnMock.mock.calls[0]?.[1]?.[0] as string
      const script = readFileSync(scriptPath, 'utf8')
      expect(script).toContain('bundle identifier mismatch')
      expect(script).toContain('version mismatch')
      expect(script).toContain('architecture mismatch')
      expect(script).toContain('codesign --verify --deep --strict')
      expect(script).not.toContain('xattr -dr com.apple.quarantine')

      if (canRunMacInstaller) {
        const fakeBinDir = join(fixtureDir, 'bin')
        const fakeOpenPath = join(fakeBinDir, 'open')
        mkdirSync(fakeBinDir, { recursive: true })
        writeFileSync(fakeOpenPath, '#!/bin/sh\nexit 0\n', 'utf8')
        chmodSync(fakeOpenPath, 0o755)
        writeFileSync(
          scriptPath,
          script.replace(/^APP_PID=\d+$/m, 'APP_PID=999999999'),
          'utf8'
        )
        execFileSync('/bin/bash', [scriptPath], {
          env: {
            ...process.env,
            PATH: `${fakeBinDir}:${process.env.PATH ?? '/usr/bin:/bin:/usr/sbin:/sbin'}`
          }
        })
        const installedVersion = execFileSync(
          '/usr/libexec/PlistBuddy',
          ['-c', 'Print :CFBundleShortVersionString', join(targetApp, 'Contents', 'Info.plist')],
          { encoding: 'utf8' }
        ).trim()
        expect(installedVersion).toBe('0.2.0')
        expect(existsSync(join(targetApp, executableRelativePath))).toBe(true)
      }
      rmSync(dirname(scriptPath), { recursive: true, force: true })
    } finally {
      rmSync(fixtureDir, { recursive: true, force: true })
    }
  })

  it('does not quit or invoke Squirrel when a macOS ZIP fails checksum verification', async () => {
    vi.spyOn(process, 'platform', 'get').mockReturnValue('darwin')
    const fixtureDir = mkdtempSync(join(tmpdir(), 'legalwork-updater-checksum-test-'))
    const zipPath = join(fixtureDir, 'legalwork-0.2.0-mac-arm64.zip')
    writeFileSync(zipPath, 'tampered update zip')
    mockExePath = join(fixtureDir, 'legalwork.app', 'Contents', 'MacOS', 'legalwork')
    mockUserDataPath = fixtureDir
    const afterQuitAndInstallAbort = vi.fn()

    try {
      const module = await import('./gui-updater')
      module.initializeGuiUpdater(
        () => null,
        () => 'stable',
        undefined,
        undefined,
        afterQuitAndInstallAbort
      )
      updater.emit('update-downloaded', {
        version: '0.2.0',
        releaseDate: '2026-06-06T00:00:00.000Z',
        downloadedFile: zipPath,
        files: [{ url: basename(zipPath), sha512: 'invalid-sha512' }]
      })

      await expect(module.installGuiUpdate()).resolves.toMatchObject({
        ok: false,
        code: 'install_failed',
        message: 'The downloaded macOS update failed SHA-512 verification.'
      })
      expect(spawnMock).not.toHaveBeenCalled()
      expect(updater.quitAndInstall).not.toHaveBeenCalled()
      expect((mockApp as typeof mockApp & { quit: ReturnType<typeof vi.fn> }).quit).not.toHaveBeenCalled()
      expect(afterQuitAndInstallAbort).toHaveBeenCalledTimes(1)
    } finally {
      rmSync(fixtureDir, { recursive: true, force: true })
    }
  })

  it('waits for managed runtime cleanup before asking the updater to quit and install', async () => {
    vi.spyOn(process, 'platform', 'get').mockReturnValue('linux')
    const module = await import('./gui-updater')
    let finishCleanup = (): void => {
      throw new Error('cleanup resolver was not set')
    }
    const beforeInstall = vi.fn(() => new Promise<void>((resolve) => {
      finishCleanup = resolve
    }))
    const beforeQuitAndInstall = vi.fn()

    module.initializeGuiUpdater(() => null, () => 'stable', beforeInstall, beforeQuitAndInstall)
    updater.emit('update-downloaded', { version: '0.2.0', releaseDate: '2026-06-06T00:00:00.000Z' })

    const installing = module.installGuiUpdate()
    await Promise.resolve()

    expect(beforeInstall).toHaveBeenCalledTimes(1)
    expect(updater.quitAndInstall).not.toHaveBeenCalled()

    finishCleanup()
    await expect(installing).resolves.toEqual({ ok: true })
    expect(beforeQuitAndInstall).toHaveBeenCalledTimes(1)
    expect(updater.quitAndInstall).toHaveBeenCalledWith(false, true)
    expect(beforeQuitAndInstall.mock.invocationCallOrder[0]).toBeLessThan(
      updater.quitAndInstall.mock.invocationCallOrder[0]
    )
  })

  it('reuses the same cleanup when the native updater emits before-quit-for-update', async () => {
    vi.spyOn(process, 'platform', 'get').mockReturnValue('linux')
    const module = await import('./gui-updater')
    let finishCleanup = (): void => {
      throw new Error('cleanup resolver was not set')
    }
    const beforeInstall = vi.fn(() => new Promise<void>((resolve) => {
      finishCleanup = resolve
    }))

    module.initializeGuiUpdater(() => null, () => 'stable', beforeInstall)
    updater.emit('update-downloaded', { version: '0.2.0', releaseDate: '2026-06-06T00:00:00.000Z' })

    nativeUpdater.emit('before-quit-for-update')
    const installing = module.installGuiUpdate()
    await Promise.resolve()

    expect(beforeInstall).toHaveBeenCalledTimes(1)
    expect(updater.quitAndInstall).not.toHaveBeenCalled()

    finishCleanup()
    await expect(installing).resolves.toEqual({ ok: true })
    expect(updater.quitAndInstall).toHaveBeenCalledWith(false, true)
  })

  it('reports an install failure when quitAndInstall does not make the app quit', async () => {
    vi.spyOn(process, 'platform', 'get').mockReturnValue('linux')
    const module = await import('./gui-updater')
    const sentStates: unknown[] = []
    const afterQuitAndInstallAbort = vi.fn()
    const win = {
      isDestroyed: () => false,
      webContents: {
        isDestroyed: () => false,
        send: vi.fn((channel: string, state: unknown) => {
          if (channel === 'gui:update-state') sentStates.push(state)
        })
      }
    }

    module.initializeGuiUpdater(
      () => win as never,
      () => 'stable',
      undefined,
      undefined,
      afterQuitAndInstallAbort
    )
    updater.emit('update-downloaded', { version: '0.2.0', releaseDate: '2026-06-06T00:00:00.000Z' })

    await expect(module.installGuiUpdate()).resolves.toEqual({ ok: true })
    expect(updater.quitAndInstall).toHaveBeenCalledWith(false, true)

    await vi.advanceTimersByTimeAsync(12_000)

    expect(module.getGuiUpdateState()).toMatchObject({
      status: 'error',
      code: 'install_failed'
    })
    expect(sentStates).toContainEqual(expect.objectContaining({
      status: 'error',
      code: 'install_failed'
    }))
    expect(afterQuitAndInstallAbort).toHaveBeenCalledTimes(1)
  })

  it('does not report a timeout failure after the app starts quitting for update', async () => {
    vi.spyOn(process, 'platform', 'get').mockReturnValue('linux')
    const module = await import('./gui-updater')

    module.initializeGuiUpdater(() => null, () => 'stable')
    updater.emit('update-downloaded', { version: '0.2.0', releaseDate: '2026-06-06T00:00:00.000Z' })

    await expect(module.installGuiUpdate()).resolves.toEqual({ ok: true })
    mockApp.emit('before-quit')
    await vi.advanceTimersByTimeAsync(12_000)

    expect(module.getGuiUpdateState()).toMatchObject({
      status: 'installing'
    })
  })
})
