# Running Server
## [MYSQL](https://www.mysql.com/downloads/)
- **Install mysql and start in port 3306**

## [UV](https://docs.astral.sh/uv/)
- **Install UV**
---
Linux
```
curl -LsSf https://astral.sh/uv/install.sh | sh
```
---
Windows
```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps | iex"
```
---
- Run `uv sync`
- Rename .env.example to .env and insert all environment variables
- Finally Run
```
uv run fastapi dev
```
