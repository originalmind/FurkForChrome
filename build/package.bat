mkdir .\FurkForChrome\
del /Q .\output\*
xcopy /E /Y /EXCLUDE:excluded-files.txt ..\src .\FurkForChrome\
pushd ".\FurkForChrome"
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --pack-extension="%CD%" --pack-extension-key="%KEY_DIR%\FurkForChrome.pem"
popd
rmdir /S /Q .\FurkForChrome\
move .\FurkForChrome.crx .\output\