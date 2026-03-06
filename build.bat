@echo off
echo ========================================
echo   Building Production Version
echo ========================================
echo.

REM Create dist directory
if exist dist (
    echo [CLEAN] Removing old dist folder...
    rmdir /s /q dist
)
echo [CREATE] Creating dist folder...
mkdir dist
mkdir dist\public
mkdir dist\public\js
mkdir dist\public\styles
mkdir dist\public\meta

REM Check if dependencies are installed
where terser >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Terser not found! Installing...
    call npm install -g terser
)

where javascript-obfuscator >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] javascript-obfuscator not found! Installing...
    call npm install -g javascript-obfuscator
)

echo.
echo ========================================
echo   Step 1: Obfuscating JavaScript
echo ========================================
echo.

echo [1/4] Obfuscating config.js...
call javascript-obfuscator public/js/config.js --output dist/public/js/config.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64 --unicode-escape-sequence true

echo [2/4] Obfuscating utils.js...
call javascript-obfuscator public/js/utils.js --output dist/public/js/utils.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64 --unicode-escape-sequence true

echo [3/4] Obfuscating modal.js...
call javascript-obfuscator public/js/modal.js --output dist/public/js/modal.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64

echo [4/4] Obfuscating app.js...
call javascript-obfuscator public/js/app.js --output dist/public/js/app.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64

echo.
echo ========================================
echo   Step 2: Minifying CSS
echo ========================================
echo.

echo [CSS] Copying and minifying CSS files...
copy public\styles\*.css dist\public\styles\ >nul

echo.
echo ========================================
echo   Step 3: Copying Assets
echo ========================================
echo.

echo [COPY] Copying images...
xcopy public\*.png dist\public\ /Y /Q >nul 2>&1
xcopy public\*.jpg dist\public\ /Y /Q >nul 2>&1
xcopy public\*.gif dist\public\ /Y /Q >nul 2>&1
xcopy public\*.svg dist\public\ /Y /Q >nul 2>&1

echo [COPY] Copying meta folder...
xcopy public\meta\*.* dist\public\meta\ /Y /Q >nul 2>&1

echo [COPY] Copying fonts...
if exist public\fonts (
    mkdir dist\public\fonts 2>nul
    xcopy public\fonts\*.* dist\public\fonts\ /Y /Q >nul 2>&1
)


echo [COPY] Copying other files...
copy public\robots.txt dist\public\ >nul 2>&1

echo.
echo ========================================
echo   Step 5: Copying HTML Files
echo ========================================
echo.

echo [HTML] Copying HTML files...
copy required.html dist\required.html >nul
copy index.html dist\index.html >nul

echo.
echo [VERCEL] Copying Vercel config...
copy dist-vercel.json dist\vercel.json >nul

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Production files are ready in: dist\
echo.
echo Folder structure:
echo   dist\
echo   ├── index.html
echo   ├── required.html
echo   └── public\
echo       ├── js\ (obfuscated)
echo       ├── styles\
echo       ├── meta\
echo       └── assets
echo.
echo You can now deploy the 'dist' folder!
echo.
pause

