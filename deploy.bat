@echo off
REM Desabilita a exibicao dos comandos
REM chcp 65001 nao é necessário aqui.

SET DEST_DIR=C:\inetpub\app-21-back
SET NODE_EXE_PATH=C:\Program Files\nodejs\node.exe
SET SOURCE_WEB_CONFIG=web.config
SET SOURCE_SCHEMA_PRISMA=.\prisma\schema.prisma
SET SOURCE_ENV=.\.env

REM Cores: 0=Preto, 1=Azul, 2=Verde, 3=Ciano, 4=Vermelho, 5=Magenta, 6=Amarelo, 7=Branco, 8=Cinza, A=Verde claro, B=Ciano claro, C=Vermelho claro, E=Amarelo claro, F=Branco brilhante.

COLOR 3F
echo =======================================================
echo Iniciando processo de Deploy Node.js para IIS
echo =======================================================
echo Destino: %DEST_DIR%

COLOR B0
echo ------------------------------------------
echo 1. Buildando o projeto TypeScript (npm run build)...
echo ------------------------------------------
call npm run build

IF %ERRORLEVEL% NEQ 0 (
    COLOR C0
    echo [ERRO] Falha no build TypeScript. Corrija os erros e tente novamente.
    pause
    exit /b 1
)

COLOR B0
echo ------------------------------------------
echo 2. Criando o diretorio de destino se nao existir...
echo ------------------------------------------
IF NOT EXIST %DEST_DIR% MKDIR %DEST_DIR%
IF NOT EXIST %DEST_DIR% (
    COLOR C0
    echo [ERRO] Nao foi possivel criar o diretorio de destino. Verifique permissoes.
    pause
    exit /b 1
)

COLOR B0
echo ------------------------------------------
echo 3. Copiando arquivos essenciais...
echo ------------------------------------------
COPY package.json %DEST_DIR%\ /Y > nul
COPY package-lock.json %DEST_DIR%\ /Y > nul
echo - package*.json copiado.

IF EXIST %SOURCE_SCHEMA_PRISMA% (
    COPY %SOURCE_SCHEMA_PRISMA% %DEST_DIR%\ /Y > nul
    echo - schema.prisma copiado.
) ELSE (
    COLOR E0
    echo [AVISO] schema.prisma nao encontrado na raiz. O Prisma Generate pode falhar.
    COLOR B0
)

IF EXIST %SOURCE_ENV% (
    COPY %SOURCE_ENV% %DEST_DIR%\ /Y > nul
    echo - .env copiado.
) ELSE (
    COLOR E0
    echo [AVISO] Arquivo .env nao encontrado na raiz. Variaveis de ambiente podem estar faltando.
    COLOR B0
)

COLOR B0
echo ------------------------------------------
echo 4. Copiando a pasta dist E a pasta gerada do Prisma...
echo ------------------------------------------
xcopy dist %DEST_DIR%\dist\ /E /I /Y > nul
echo - Pasta dist copiada.

IF EXIST src\lib\generated\prisma (
    xcopy src\lib\generated\prisma %DEST_DIR%\dist\lib\generated\prisma\ /E /I /Y > nul
    echo - Pasta gerada do Prisma copiada.
)

COLOR B0
echo ------------------------------------------
echo 5. Copiando a pasta node_modules... (Pode demorar bastante!)
echo ------------------------------------------
xcopy node_modules %DEST_DIR%\node_modules\ /E /I /Y > nul
echo - node_modules copiado.

COLOR B0
echo ------------------------------------------
echo 6. Copiando ou criando o web.config...
echo ------------------------------------------
IF NOT EXIST %SOURCE_WEB_CONFIG% (
    COLOR E0
    echo [AVISO] web.config nao encontrado. Criando um padrao na origem.
    COLOR B0
    echo ^<configuration^>^<system.webServer^>^<handlers^>^<add name="httpplatformhandler" path="*" verb="*" modules="httpPlatformHandler" resourceType="Unspecified" requireAccess="Script" /^>^</handlers^>^<httpPlatform stdoutLogEnabled="true" stdoutLogFile=".\node.log" startupTimeLimit="20" processPath="%NODE_EXE_PATH%" arguments=".\dist\app.js"^>^<environmentVariables^>^<environmentVariable name="PORT" value="%%HTTP_PLATFORM_PORT%%" /^>^<environmentVariable name="NODE_ENV" value="Production" /^>^</environmentVariables^>^</httpPlatform^>^</system.webServer^>^</configuration^> > %SOURCE_WEB_CONFIG%
)
COPY %SOURCE_WEB_CONFIG% %DEST_DIR%\ /Y > nul
echo - web.config pronto.


COLOR B0
echo ------------------------------------------
echo 7. Gerando o cliente Prisma no destino (Garante compatibilidade)...
echo ------------------------------------------
CD %DEST_DIR%
call npx prisma generate
IF %ERRORLEVEL% NEQ 0 (
    COLOR C0
    echo [ERRO] Falha ao gerar o cliente Prisma. Verifique o schema.prisma e a conexao com o BD.
    pause & exit /b 1
)
CD %~dp0

COLOR A0
echo =======================================================
echo Deploy concluido com sucesso em %DEST_DIR%!
echo Lembre-se de reiniciar o App Pool no IIS Manager.
echo =======================================================

pause
REM Reseta a cor para o padrao do sistema no final
COLOR
