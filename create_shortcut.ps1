$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath('Desktop')

# Shortcut 1: Web App Launcher
$Shortcut1 = $WshShell.CreateShortcut("$DesktopPath\Blockchain Inventory Management.lnk")
$Shortcut1.TargetPath = "C:\Users\saras\OneDrive\Desktop\BLOCKCHAIN_BASED_INVENTORY_MANAGEMENT\Run_Web_App.bat"
$Shortcut1.WorkingDirectory = "C:\Users\saras\OneDrive\Desktop\BLOCKCHAIN_BASED_INVENTORY_MANAGEMENT"
$Shortcut1.IconLocation = "shell32.dll,14"
$Shortcut1.Save()

# Shortcut 2: Direct Browser Open
$Shortcut2 = $WshShell.CreateShortcut("$DesktopPath\Open Blockchain App in Browser.lnk")
$Shortcut2.TargetPath = "C:\Users\saras\OneDrive\Desktop\BLOCKCHAIN_BASED_INVENTORY_MANAGEMENT\Open_In_Browser.bat"
$Shortcut2.WorkingDirectory = "C:\Users\saras\OneDrive\Desktop\BLOCKCHAIN_BASED_INVENTORY_MANAGEMENT"
$Shortcut2.IconLocation = "shell32.dll,220"
$Shortcut2.Save()

Write-Host "Desktop shortcuts created successfully!"
