[Setup]
AppName=Kawaii
AppVersion=2.1.0
DefaultDirName={pf}\Kawaii
DefaultGroupName=Kawaiir
Publisher=Faizinuha
OutputDir=.
OutputBaseFilename=KawaiiSetup
SetupIconFile=kawaii.ico

[Files]
Source: "dist\*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
Name: "{group}\Kawaii"; Filename: "{app}\Kawaii.exe"

[Run]
Filename: "{app}\Kawaii.exe"; Description: "Launch Kawaii Installer"; Flags: nowait postinstall skipifsilent
