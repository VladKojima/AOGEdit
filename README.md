# Редактор графов И/ИЛИ
# Описание
Данное веб-приложение позволяет создавать, сохранять и использовать И/ИЛИ графы.
# Установка и запуск
## Скрипты
Действия автоматизированы при помощи bash-скриптов:
- build.sh - создать контейнер приложения
- init.sh - создать конфигурацию
- run.sh - запустить приложение
- full.sh - запуск описанных выше скриптов для полного выполнения процедуры установки и запуска
## Порядок инициализации конфигурации
Для инициализации конфигурации запустите скрипт init.sh и введите:
1. Пароль для учетной записи приложения в БД
2. Пароль для учетной записи админа БД
3. Email для входа в PgAdmin
4. Пароль для входа в PgAdmin
5. Порт для приложения
6. Порт для PgAdmin
7. Порт для PgAdmin на протоколе HTTPS
