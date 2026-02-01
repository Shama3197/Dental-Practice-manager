# SMTP Configuration Update Script
Write-Host "=== SMTP Configuration Setup ===" -ForegroundColor Green
Write-Host ""

Write-Host "Choose your email provider:" -ForegroundColor Yellow
Write-Host "1. Gmail (Recommended for testing)"
Write-Host "2. Outlook/Hotmail"
Write-Host "3. Custom SMTP Server"
Write-Host "4. Skip SMTP setup (registration will work without email verification)"
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`n=== Gmail Configuration ===" -ForegroundColor Cyan
        Write-Host "For Gmail, you need to:"
        Write-Host "1. Enable 2-Factor Authentication on your Gmail account"
        Write-Host "2. Generate an App Password (not your regular password)"
        Write-Host "   - Go to Google Account → Security → 2-Step Verification → App passwords"
        Write-Host "   - Generate password for 'Mail'"
        Write-Host ""
        
        $email = Read-Host "Enter your Gmail address"
        $appPassword = Read-Host "Enter your Gmail App Password (not regular password)" -AsSecureString
        $appPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($appPassword))
        
        $smtpConfig = @"
# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=$email
SMTP_PASS=$appPasswordPlain
SMTP_FROM=Dental Practice Manager <$email>
"@
    }
    "2" {
        Write-Host "`n=== Outlook/Hotmail Configuration ===" -ForegroundColor Cyan
        $email = Read-Host "Enter your Outlook/Hotmail address"
        $password = Read-Host "Enter your password" -AsSecureString
        $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        
        $smtpConfig = @"
# SMTP Configuration (Outlook)
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=$email
SMTP_PASS=$passwordPlain
SMTP_FROM=Dental Practice Manager <$email>
"@
    }
    "3" {
        Write-Host "`n=== Custom SMTP Configuration ===" -ForegroundColor Cyan
        $smtpHost = Read-Host "Enter SMTP host (e.g., smtp.yourdomain.com)"
        $port = Read-Host "Enter SMTP port (e.g., 587)"
        $secure = Read-Host "Use SSL? (true/false)"
        $email = Read-Host "Enter your email address"
        $password = Read-Host "Enter your password" -AsSecureString
        $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        
        $smtpConfig = @"
# SMTP Configuration (Custom)
SMTP_HOST=$smtpHost
SMTP_PORT=$port
SMTP_SECURE=$secure
SMTP_USER=$email
SMTP_PASS=$passwordPlain
SMTP_FROM=Dental Practice Manager <$email>
"@
    }
    "4" {
        Write-Host "`n=== Skipping SMTP Setup ===" -ForegroundColor Yellow
        Write-Host "Registration will work, but email verification will be disabled."
        Write-Host "You can configure SMTP later by editing the .env file manually."
        return
    }
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor Red
        return
    }
}

# Update the .env file
Write-Host "`nUpdating .env file..." -ForegroundColor Green

# Read current .env content
$envContent = Get-Content .env -Raw

# Remove old SMTP configuration
$envContent = $envContent -replace "(?s)# SMTP Configuration.*?(?=\n\n|\Z)", ""

# Add new SMTP configuration
$envContent = $envContent.TrimEnd() + "`n`n" + $smtpConfig

# Write back to .env file
$envContent | Set-Content .env -NoNewline

Write-Host "SMTP configuration updated successfully!" -ForegroundColor Green
Write-Host "You can now test the registration with email verification." -ForegroundColor Green 