@echo off
echo ==========================================
echo    UNIVERSAL GITHUB PUSHER
echo ==========================================
echo.

:: 1. Initialize Git
echo [1/5] Initializing Git repository...
git init
if %errorlevel% neq 0 goto :error

:: 2. Configure User (if not set, just to be safe - skipping this as it might overwrite user prefs, assuming they have git config)

:: 3. Add all files
echo.
echo [2/5] Adding files to staging area...
git add .
if %errorlevel% neq 0 goto :error

:: 4. Commit
echo.
echo [3/5] Committing changes...
git commit -m "Force update portfolio"
:: Ignore error here if nothing to commit

:: 5. Rename branch to main
echo.
echo [4/5] Setting branch to 'main'...
git branch -M main

:: 6. Set Remote URL
echo.
echo [5/5] Setting remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/Mustychampion/portpolio.git

:: 7. Push
echo.
echo [FINAL] Pushing to GitHub (Force Mode)...
echo Please sign in if a popup appears.
echo.
git push -u origin main --force
if %errorlevel% neq 0 goto :error

echo.
echo ==========================================
echo    SUCCESS! PROJECT PUSHED.
echo ==========================================
pause
exit /b 0

:error
echo.
echo ==========================================
echo    ERROR OCCURRED. SEE ABOVE.
echo ==========================================
echo Common fixes:
echo 1. Check your internet connection.
echo 2. Ensure you have permission to write to this repository.
echo 3. Ensure Git is installed (type 'git --version').
echo.
pause
exit /b 1
