# SCCS GPA Calculator (v2)

This is the next-generation version of the Swarthmore College Computer Society's GPA Calculator. This works for Swarthmore College grades only. NOTE: We are not affiliated with the Swarthmore College Registrar and changes to the Grades at a Glace page without warning may impact the functionality of our service.

## How to Use

1. Navigate to https://gpacalc.sccs.swarthmore.edu
2. Copy-paste your entry from Grades at a Glance in MySwarthmore (now requires a VPN for some reason) into the large text box
3. Brace yourself and click calculate

## Codebase

- Dockerized Node.JS-based React app
- Entirely client-side logic; no server-side storage of GPA etc.
- Currently containerized statically-served assets (html, images, manifest, robots)

To start dev environment:
```bash
docker compose -f docker-compose.debug.yml up
```

To start or update prod environment:
```bash
docker compose -f docker-compose.yml up --build
```

To fix ridiculous issues that may crop up with Docker's build cache:
```build
docker compose -f <file> build --no-cache
```
