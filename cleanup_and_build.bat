@echo off
rem =====================================================
rem Cleanup duplicate Flyway migration files and run the app
rem =====================================================

rem Delete duplicate migration files (if they exist)
del /f /q "src\\main\\resources\\db\\migration\\V8__user_constraints.sql"
del /f /q "src\\main\\resources\\db\\migration\\V8__email_tables.sql"
del /f /q "src\\main\\resources\\db\\migration\\V11__email_tables.sql"

rem Ensure V10__email_tables.sql already contains the full email tables definition.
rem (No action needed – the file is correct.)

rem Clean the Maven build (removes target folder)
mvn clean

rem Build and start the Spring Boot application
mvn spring-boot:run
