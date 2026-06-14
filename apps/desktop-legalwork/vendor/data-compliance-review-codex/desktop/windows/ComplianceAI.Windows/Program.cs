using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Sockets;
using System.Text;

namespace ComplianceAI.Windows;

internal static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new MainForm());
    }
}

internal sealed class MainForm : Form
{
    private readonly WebView2 _webView;
    private readonly Panel _loadingPanel;
    private readonly Label _statusLabel;
    private Process? _serverProcess;
    private readonly string _baseDir;
    private readonly string _webDir;
    private readonly string _pythonDir;
    private readonly int _port;
    private readonly string _logDir;
    private readonly string _logPath;

    public MainForm()
    {
        _baseDir = AppContext.BaseDirectory;
        _webDir = Path.Combine(_baseDir, "payload", "web");
        _pythonDir = Path.Combine(_baseDir, "python");
        _port = GetFreePort();
        _logDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "ComplianceAI",
            "logs");
        Directory.CreateDirectory(_logDir);
        _logPath = Path.Combine(_logDir, "startup.log");
        File.WriteAllText(_logPath, $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] ComplianceAI startup{Environment.NewLine}");

        Text = "ComplianceAI";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(1200, 820);
        ClientSize = new Size(1440, 960);

        _webView = new WebView2
        {
            Dock = DockStyle.Fill,
            DefaultBackgroundColor = Color.White,
        };
        _webView.NavigationCompleted += OnNavigationCompleted;
        _webView.Visible = false;

        _statusLabel = new Label
        {
            Dock = DockStyle.Fill,
            TextAlign = ContentAlignment.MiddleCenter,
            Font = new Font("Segoe UI", 13, FontStyle.Regular),
            ForeColor = Color.FromArgb(71, 85, 105),
            Text = "正在启动 ComplianceAI，请稍候…",
        };

        _loadingPanel = new Panel
        {
            Dock = DockStyle.Fill,
            BackColor = Color.White,
        };
        _loadingPanel.Controls.Add(_statusLabel);

        Controls.Add(_loadingPanel);
        Controls.Add(_webView);
        FormClosing += OnFormClosing;
        Shown += async (_, __) => await StartAsync();
    }

    private async Task StartAsync()
    {
        try
        {
            SetStatus("正在检查打包资源…");
            EnsureBundle();
            SetStatus("正在启动本地服务…");
            StartServer();
            SetStatus("正在等待服务响应…");
            await WaitForServerAsync();

            var userDataDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "ComplianceAI",
                "WebView2");
            Directory.CreateDirectory(userDataDir);
            Log($"WebView2 user data dir: {userDataDir}");

            SetStatus("正在初始化界面引擎…");
            var env = await CoreWebView2Environment.CreateAsync(null, userDataDir);
            await _webView.EnsureCoreWebView2Async(env);
            var target = new Uri($"http://127.0.0.1:{_port}/");
            Log($"Navigating to {target}");
            SetStatus("正在加载应用界面…");
            _webView.Source = target;
        }
        catch (Exception ex)
        {
            Log("Startup failed: " + ex);
            MessageBox.Show(
                $"ComplianceAI 启动失败\n\n{ex.Message}\n\n日志位置：{_logPath}",
                "ComplianceAI",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
            Close();
        }
    }

    private void EnsureBundle()
    {
        string[] requiredPaths =
        {
            Path.Combine(_webDir, "server_entry.py"),
            Path.Combine(_webDir, "app.py"),
            Path.Combine(_webDir, "templates"),
            Path.Combine(_baseDir, "payload", "projects", "data-compliance-ai-project-kit", "knowledge-base", "local-regulations.sqlite3"),
            Path.Combine(_pythonDir, "python.exe"),
        };

        foreach (var path in requiredPaths)
        {
            if (!File.Exists(path) && !Directory.Exists(path))
            {
                Log($"Missing required path: {path}");
                throw new InvalidOperationException($"缺少运行资源：{path}");
            }
        }
    }

    private void StartServer()
    {
        var pythonExe = Path.Combine(_pythonDir, "python.exe");
        var startInfo = new ProcessStartInfo
        {
            FileName = pythonExe,
            WorkingDirectory = _webDir,
            Arguments = $"server_entry.py --port {_port}",
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            StandardOutputEncoding = Encoding.UTF8,
            StandardErrorEncoding = Encoding.UTF8,
        };

        startInfo.Environment["COMPLIANCEAI_PYTHON"] = pythonExe;
        startInfo.Environment["PYTHONUNBUFFERED"] = "1";
        startInfo.Environment["COMPLIANCEAI_LOG_PATH"] = _logPath;

        _serverProcess = new Process { StartInfo = startInfo, EnableRaisingEvents = true };
        _serverProcess.OutputDataReceived += (_, e) =>
        {
            if (!string.IsNullOrWhiteSpace(e.Data))
            {
                Log("[stdout] " + e.Data);
            }
        };
        _serverProcess.ErrorDataReceived += (_, e) =>
        {
            if (!string.IsNullOrWhiteSpace(e.Data))
            {
                Log("[stderr] " + e.Data);
            }
        };
        _serverProcess.Exited += (_, __) =>
        {
            Log($"Server process exited with code {_serverProcess?.ExitCode}");
        };
        _serverProcess.Start();
        Log($"Started server process pid={_serverProcess.Id}");
        _serverProcess.BeginOutputReadLine();
        _serverProcess.BeginErrorReadLine();
    }

    private async Task WaitForServerAsync()
    {
        using var client = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(2)
        };
        var deadline = DateTime.UtcNow.AddSeconds(45);
        var uri = new Uri($"http://127.0.0.1:{_port}/");

        while (DateTime.UtcNow < deadline)
        {
            try
            {
                var response = await client.GetAsync(uri);
                Log($"Health check status: {(int)response.StatusCode}");
                if (response.IsSuccessStatusCode)
                {
                    return;
                }
            }
            catch (Exception ex)
            {
                Log("Health check failed: " + ex.Message);
            }

            await Task.Delay(300);
        }

        throw new TimeoutException("应用启动超时，请检查打包资源是否完整。");
    }

    private void OnNavigationCompleted(object? sender, CoreWebView2NavigationCompletedEventArgs e)
    {
        Log($"Navigation completed. success={e.IsSuccess} status={e.WebErrorStatus}");
        if (e.IsSuccess)
        {
            _loadingPanel.Visible = false;
            _webView.Visible = true;
            return;
        }

        _loadingPanel.Visible = true;
        _webView.Visible = false;
        _statusLabel.Text = "界面加载失败，正在尝试用默认浏览器打开…";

        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = $"http://127.0.0.1:{_port}/",
                UseShellExecute = true
            });
        }
        catch (Exception ex)
        {
            Log("Fallback browser launch failed: " + ex.Message);
        }
    }

    private void OnFormClosing(object? sender, FormClosingEventArgs e)
    {
        try
        {
            if (_serverProcess is { HasExited: false })
            {
                _serverProcess.Kill(entireProcessTree: true);
                _serverProcess.WaitForExit(2000);
            }
        }
        catch
        {
            // ignore shutdown errors
        }
    }

    private void SetStatus(string message)
    {
        Log(message);
        _statusLabel.Text = message;
        _statusLabel.Refresh();
    }

    private void Log(string message)
    {
        var line = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}{Environment.NewLine}";
        File.AppendAllText(_logPath, line, Encoding.UTF8);
        Debug.WriteLine(message);
    }

    private static int GetFreePort()
    {
        using var listener = new TcpListener(System.Net.IPAddress.Loopback, 0);
        listener.Start();
        return ((System.Net.IPEndPoint)listener.LocalEndpoint).Port;
    }
}
