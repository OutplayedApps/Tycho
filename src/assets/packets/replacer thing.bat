@echo off
dir /b /s /a-d *(*).* |find /i /v "%~nx0" |find /i /v "repl.bat" |repl ".*\\(.*)\(.*\)(\..*)" "ren \q$&\q \q$1$2\q" xa >"renfiles.bat.txt"