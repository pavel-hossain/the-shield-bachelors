import React, { useState, useEffect } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Smartphone,
  Download,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
  Code,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  Settings,
  Copy,
  Check,
  Package,
} from 'lucide-react';

export const APKConvertModal: React.FC = () => {
  const { isAPKModalOpen, setIsAPKModalOpen } = useMess();

  const [activeTab, setActiveTab] = useState<'instant' | 'pwabuilder' | 'capacitor'>('instant');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isAPKModalOpen) return null;

  const currentAppUrl = window.location.href;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPWAInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install as native Android WebAPK:\n1. Open this app in Chrome on your Android phone.\n2. Tap the Chrome menu (⋮) -> select "Add to Home screen" or "Install app".'
      );
    }
  };

  const handleDownloadCapacitorConfig = () => {
    const config = {
      appId: 'com.shieldmess.app',
      appName: 'The Shield Bachelors Mess',
      webDir: 'dist',
      bundledWebRuntime: false,
      server: {
        url: currentAppUrl,
        cleartext: true,
      },
      android: {
        allowMixedContent: true,
        captureInput: true,
        backgroundColor: '#0f172a',
      },
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capacitor.config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAndroidManifest = () => {
    const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.shieldmess.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="The Shield Mess"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:label="The Shield Mess"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

    const blob = new Blob([manifestXml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AndroidManifest.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyBuildScript = () => {
    const script = `npm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap init "The Shield Mess" "com.shieldmess.app"\nnpx cap add android\nnpx cap open android`;
    navigator.clipboard.writeText(script);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <span>Convert to Android APK</span>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Android Native
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Turn this web app into a standalone Android APK or native app bundle
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAPKModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('instant')}
            className={`pb-2 px-3 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'instant'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>1-Click WebAPK (PWA)</span>
          </button>
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`pb-2 px-3 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'pwabuilder'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>PWABuilder APK Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('capacitor')}
            className={`pb-2 px-3 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'capacitor'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Capacitor / Android Studio</span>
          </button>
        </div>

        {/* TAB 1: 1-Click Instant WebAPK */}
        {activeTab === 'instant' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Android WebAPK Engine Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Installs as a real Android application with app icon in app drawer, full screen
                  display, and offline voice sync.
                </p>
              </div>

              <button
                onClick={handleInstallPWA}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer hover-glow"
              >
                <Download className="w-4 h-4" />
                <span>{isPWAInstalled ? 'App Already Installed' : 'Install Android App'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                How it works on Android Phones:
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                <li>
                  Open Chrome on your Android device at <span className="font-mono text-emerald-600 dark:text-emerald-400">{currentAppUrl.substring(0, 32)}...</span>
                </li>
                <li>Tap the <strong>Chrome Menu (⋮)</strong> at top right.</li>
                <li>
                  Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                </li>
                <li>
                  Android builds a native <strong>WebAPK shell</strong> with your app icon on your home screen!
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: PWABuilder Cloud APK Generator */}
        {activeTab === 'pwabuilder' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Cloud APK Build Link</span>
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                  Free Cloud Build
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Use Microsoft&apos;s PWABuilder to generate a signed <code className="font-mono text-amber-600 dark:text-amber-400">.apk</code> or <code className="font-mono text-amber-600 dark:text-amber-400">.aab</code> package ready for direct installation or Google Play Store publishing.
              </p>

              <a
                href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentAppUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer hover-glow"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate APK on PWABuilder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <span className="font-bold block">Steps on PWABuilder:</span>
              <p className="text-[11px]">
                1. Click the button above -&gt; 2. Click <strong>Package for Store</strong> -&gt; 3. Select <strong>Android</strong> -&gt; 4. Click <strong>Generate APK</strong>.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: Capacitor / Android Studio */}
        {activeTab === 'capacitor' && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-500" />
                <span>Download Android Capacitor Configurations</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleDownloadCapacitorConfig}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-xl text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      capacitor.config.json
                    </span>
                    <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Capacitor native shell configuration
                  </p>
                </button>

                <button
                  onClick={handleDownloadAndroidManifest}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-xl text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      AndroidManifest.xml
                    </span>
                    <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Android native app manifest & permissions
                  </p>
                </button>
              </div>
            </div>

            {/* Terminal Commands */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Capacitor Android Build CLI Commands:
                </span>
                <button
                  onClick={copyBuildScript}
                  className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800 leading-relaxed">
{`npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "The Shield Mess" "com.shieldmess.app"
npx cap add android
npx cap open android`}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsAPKModalOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
