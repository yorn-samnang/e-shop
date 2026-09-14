#!/usr/bin/env bash
docker compose --profile dev down -d --build
docker compose --profile prod down -d --build
