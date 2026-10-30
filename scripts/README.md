# Scripts

| Archivo | Uso |
|---------|-----|
| `analisis-piloto.py` | Calcula t-test, Cohen d y NPS desde `data/piloto-*.template.csv` y actualiza `docs/producto/informe-piloto.md`. |
| `deploy/build.sh` | Build completo del sandbox (Next.js + runtime). |
| `deploy/dev.sh` | Arranque de desarrollo con mini-servicios. |
| `deploy/start.sh` | Arranque de producción. |
| `deploy/database-runtime-build.sh` | Prepara la base de datos del despliegue. |
| `deploy/python-runtime-build.sh` | Empaqueta un runtime de Python si el proyecto lo requiere. |
| `deploy/mini-services-install.sh` | Instala dependencias de cada mini-servicio. |
| `deploy/mini-services-build.sh` | Compila los mini-servicios. |
| `deploy/mini-services-start.sh` | Arranca los mini-servicios. |

## Análisis del piloto

```bash
python scripts/analisis-piloto.py
```

## Despliegue

Los scripts de `deploy/` son específicos del sandbox Linux (`/home/z/my-project`,
`BUILD_ID`, `uv`, Caddy). No se usan en local; están expuestos como
`npm run deploy:*` (ver [`docs/desarrollo/README.md`](../docs/desarrollo/README.md)).

Pruebas de esos scripts:

```bash
bash tests/database-runtime-build.sh
bash tests/python-runtime-build.sh
```
