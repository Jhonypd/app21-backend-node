@echo off
SET DEST_DIR=C:\inetpub\APP21-back
SET NODE_EXE_PATH=C:\Program Files\nodejs\node.exe
SET SOURCE_WEB_CONFIG=web.config
SET SOURCE_SCHEMA_PRISMA=schema.prisma
SET SOURCE_ENV=.\.env

echo =======================================================
echo Iniciando processo de Deploy Node.js para IIS
echo =======================================================
echo Destino: %DEST_DIR%

echo ------------------------------------------
echo 1. Buildando o projeto TypeScript (npm run build)...
echo ------------------------------------------
call npm run build

IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha no build TypeScript. Corrija os erros e tente novamente.
    pause
    exit /b 1
)

echo ------------------------------------------
echo 2. Criando o diretorio de destino se nao existir...
echo ------------------------------------------
IF NOT EXIST %DEST_DIR% MKDIR %DEST_DIR%
IF NOT EXIST %DEST_DIR% (
    echo [ERRO] Nao foi possivel criar o diretorio de destino. Verifique permissoes.
    pause
    exit /b 1
)

echo ------------------------------------------
echo 3. Copiando arquivos essenciais...
echo ------------------------------------------
COPY package.json %DEST_DIR%\ /Y
COPY package-lock.json %DEST_DIR%\ /Y

IF EXIST %SOURCE_SCHEMA_PRISMA% (
    COPY %SOURCE_SCHEMA_PRISMA% %DEST_DIR%\ /Y
    echo - schema.prisma copiado.
) ELSE (
    echo [AVISO] schema.prisma nao encontrado na raiz. O Prisma Generate pode falhar.
)

IF EXIST %SOURCE_ENV% (
    COPY %SOURCE_ENV% %DEST_DIR%\ /Y
    echo - .env copiado.
) ELSE (
    echo [AVISO] Arquivo .env nao encontrado na raiz. Variaveis de ambiente podem estar faltando.
)

echo ------------------------------------------
echo 4. Copiando a pasta dist E a pasta gerada do Prisma...
echo ------------------------------------------
xcopy dist %DEST_DIR%\dist\ /E /I /Y

REM Adicionado para copiar a pasta especifica do prisma que seu codigo espera encontrar
IF EXIST src\lib\generated\prisma xcopy src\lib\generated\prisma %DEST_DIR%\dist\lib\generated\prisma\ /E /I /Y

echo ------------------------------------------
echo 5. Copiando a pasta node_modules... (Pode demorar bastante!)
echo ------------------------------------------
xcopy node_modules %DEST_DIR%\node_modules\ /E /I /Y

echo ------------------------------------------
echo 6. Copiando ou criando o web.config...
echo ------------------------------------------
IF NOT EXIST %SOURCE_WEB_CONFIG% (
    echo [AVISO] web.config nao encontrado. Criando um padrao na origem.
    echo ^<configuration^>^<system.webServer^>^<handlers^>^<add name="httpplatformhandler" path="*" verb="*" modules="httpPlatformHandler" resourceType="Unspecified" requireAccess="Script" /^>^</handlers^>^<httpPlatform stdoutLogEnabled="true" stdoutLogFile=".\node.log" startupTimeLimit="20" processPath="%NODE_EXE_PATH%" arguments=".\dist\app.js"^>^<environmentVariables^>^<environmentVariable name="PORT" value="%%HTTP_PLATFORM_PORT%%" /^>^<environmentVariable name="NODE_ENV" value="Production" /^>^</environmentVariables^>^</httpPlatform^>^</system.webServer^>^</configuration^> > %SOURCE_WEB_CONFIG%
)
COPY %SOURCE_WEB_CONFIG% %DEST_DIR%\ /Y


echo ------------------------------------------
echo 7. Gerando o cliente Prisma no destino (Garante compatibilidade)...
echo ------------------------------------------
REM Muda para o diretorio de destino para garantir que o generate rode no local correto
CD %DEST_DIR%
call npx prisma generate
IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao gerar o cliente Prisma. Verifique o schema.prisma e a conexao com o BD.
    pause & exit /b 1
)
REM Volta para o diretorio original
CD %~dp0


echo =======================================================
echo Deploy concluido com sucesso em %DEST_DIR%!
echo Lembre-se de reiniciar o App Pool no IIS Manager.
echo =======================================================

pause
