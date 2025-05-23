@echo off
echo 📦 Installing dependencies...
npm install

echo 🏗️  Starting APK build with EAS...
eas build -p android --profile preview

echo ✅ APK build initiated. Follow the link provided by EAS CLI to download your APK when complete.
pause
