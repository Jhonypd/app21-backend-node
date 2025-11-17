@echo off
chcp 65001 > nul
SETLOCAL ENABLEDELAYEDEXPANSION

REM ===========================================================================
REM Configurações
REM ===========================================================================
SET DEST_DIR=C:\inetpub\app-21-back
SET NODE_EXE_PATH=C:\Program Files\nodejs\node.exe
SET SOURCE_WEB_CONFIG=web.config
SET SOURCE_SCHEMA_PRISMA=.\prisma\schema.prisma
SET SOURCE_ENV=.\.env

REM ===========================================================================
REM Estilos (cores ANSI)
REM ===========================================================================
set "C_RESET=[0m"
set "C_TITLE=[1;96m"
set "C_SECTION=[1;94m"
set "C_OK=[1;92m"
set "C_ERR=[1;91m"
set "C_WARN=[1;93m"
set "C_INFO=[90m"
set "C_TEXT=[1;97m"

cls

echo.
echo %C_TITLE%╔══════════════════════════════════════════════════════════════════════╗%C_RESET%
echo %C_TITLE%║                    Deploy Node.js para IIS - v1.0                     ║%C_RESET%
echo %C_TITLE%╚══════════════════════════════════════════════════════════════════════╝%C_RESET%
echo.
echo %C_TEXT%Destino final:%C_RESET% %DEST_DIR%
echo.


REM ===========================================================================
REM 1. BUILD
REM ===========================================================================
echo %C_SECTION%────────────────────────── 1. Buildando o projeto ─────────────────────────%C_RESET%

call npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo %C_ERR%[ERRO] Falha no build. Corrija erros e tente novamente.%C_RESET%
    pause
    exit /b 1
)
echo %C_OK%[OK] Build concluído.%C_RESET%
echo.


REM ===========================================================================
REM 2. PREPARAR DIRETÓRIO
REM ===========================================================================
echo %C_SECTION%────────────────────────── 2. Preparando diretório ───────────────────────%C_RESET%

IF NOT EXIST %DEST_DIR% MKDIR %DEST_DIR%
IF NOT EXIST %DEST_DIR% (
    echo %C_ERR%[ERRO] Não foi possível criar o diretório de destino.%C_RESET%
    pause
    exit /b 1
)

echo %C_OK%[OK] Diretório OK.%C_RESET%
echo.


REM ===========================================================================
REM 3. COPIAR ARQUIVOS ESSENCIAIS
REM ===========================================================================
echo %C_SECTION%────────────────────────── 3. Copiando arquivos essenciais ───────────────%C_RESET%

COPY package.json %DEST_DIR%\ /Y > nul
COPY package-lock.json %DEST_DIR%\ /Y > nul
echo %C_OK%[OK] package.json e lock.json copiados.%C_RESET%

IF EXIST %SOURCE_SCHEMA_PRISMA% (
    COPY %SOURCE_SCHEMA_PRISMA% %DEST_DIR%\ /Y > nul
    echo %C_OK%[OK] schema.prisma copiado.%C_RESET%
) ELSE (
    echo %C_WARN%[AVISO] schema.prisma não encontrado.%C_RESET%
)

IF EXIST %SOURCE_ENV% (
    COPY %SOURCE_ENV% %DEST_DIR%\ /Y > nul
    echo %C_OK%[OK] .env copiado.%C_RESET%
) ELSE (
    echo %C_WARN%[AVISO] .env não encontrado.%C_RESET%
)

echo.


REM ===========================================================================
REM 4. COPIAR DIST
REM ===========================================================================
echo %C_SECTION%────────────────────────── 4. Copiando dist ───────────────────────────────%C_RESET%

xcopy dist %DEST_DIR%\dist\ /E /I /Y > nul
echo %C_OK%[OK] dist copiada.%C_RESET%
IF EXIST src\lib\generated\prisma (
    xcopy src\lib\generated\prisma %DEST_DIR%\dist\lib\generated\prisma\ /E /I /Y > nul
    echo - Pasta gerada do Prisma copiada.
)
echo.

REM ===========================================================================
REM 5. COPIAR NODE_MODULES
REM ===========================================================================
echo %C_SECTION%────────────────────────── 5. Copiando node_modules ──────────────────────%C_RESET%

xcopy node_modules %DEST_DIR%\node_modules\ /E /I /Y > nul
echo %C_OK%[OK] node_modules copiado.%C_RESET%
echo.


REM ===========================================================================
REM 6. COPIAR / GERAR WEB.CONFIG
REM ===========================================================================
echo %C_SECTION%────────────────────────── 6. Copiando web.config ─────────────────────────%C_RESET%

IF NOT EXIST %SOURCE_WEB_CONFIG% (
    echo %C_WARN%[AVISO] web.config não encontrado. Criando padrão...%C_RESET%
    (
        echo ^<configuration^>
        echo   ^<system.webServer^>
        echo     ^<handlers^>
        echo       ^<add name="httpplatformhandler" path="*" verb="*" modules="httpPlatformHandler" resourceType="Unspecified" requireAccess="Script" /^>
        echo     ^</handlers^>
        echo     ^<httpPlatform stdoutLogEnabled="true" stdoutLogFile=".\logs\node.log" startupTimeLimit="20" processPath="%NODE_EXE_PATH%" arguments=".\dist\app.js"^>
        echo       ^<environmentVariables^>
        echo         ^<environmentVariable name="PORT" value="%%HTTP_PLATFORM_PORT%%" /^>
        echo         ^<environmentVariable name="NODE_ENV" value="production" /^>
        echo       ^</environmentVariables^>
        echo     ^</httpPlatform^>
        echo   ^</system.webServer^>
        echo ^</configuration^>
    ) > %SOURCE_WEB_CONFIG%
)

COPY %SOURCE_WEB_CONFIG% %DEST_DIR%\ /Y > nul
echo %C_OK%[OK] web.config pronto.%C_RESET%
echo.


REM ===========================================================================
REM 7. PRISMA GENERATE
REM ===========================================================================
echo %C_SECTION%────────────────────────── 7. Gerando Prisma Client ───────────────────────%C_RESET%

CD %DEST_DIR%
call npx prisma generate
IF %ERRORLEVEL% NEQ 0 (
    echo %C_ERR%[ERRO] Falha ao gerar o Prisma Client.%C_RESET%
    pause
    exit /b 1
)
CD %~dp0
echo %C_OK%[OK] Prisma Client gerado.%C_RESET%
echo.


REM ===========================================================================
REM FINAL
REM ===========================================================================
echo %C_TITLE%╔══════════════════════════════════════════════════════════════════════╗%C_RESET%
echo %C_TITLE%║                    ✔ DEPLOY CONCLUÍDO COM SUCESSO ✔                   ║%C_RESET%
echo %C_TITLE%╚══════════════════════════════════════════════════════════════════════╝%C_RESET%
echo.
echo %C_INFO%Reinicie o App Pool no IIS para aplicar as mudanças.%C_RESET%
echo.
pause
