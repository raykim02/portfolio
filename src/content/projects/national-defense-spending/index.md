---
title: National Defense Spending ELT Pipeline
summary: An automated ELT pipeline on AWS that loads 40M+ federal defense contract transactions into a tested dbt star schema and a Power BI dashboard.
date: 2026-11-01
status: complete
tags: [Python, AWS S3, Redshift Serverless, dbt, Airflow, Docker, Power BI]
github: https://github.com/raykim02/national-defense-spending
cover: ./01_overview.png
coverAlt: Power BI dashboard overview showing national defense contract obligations by year, FY2017 to FY2026, with DOE defense and DHS/DOT trend lines
---

## Problem

Where does U.S. defense contract money actually go, and how has that changed? USASpending.gov publishes every federal contract transaction, but as bulk files with 297 columns, regenerated monthly, plus change files that update and delete earlier rows. That's hard to answer questions from directly.

I built a pipeline that loads defense contract spending from FY2017 on, about 41.8 million transactions, and models it so questions can be answered with tested SQL and a dashboard. Scope is OMB's National Defense budget function (050): the Department of Defense, plus the defense parts of Energy, Homeland Security, and Transportation.

## How it's built

![Architecture: USASpending bulk files flow through a Python extract into S3, are loaded into Redshift Serverless, transformed by dbt, and reported in Power BI, with Airflow running the pipeline monthly](./architecture.svg)

- **Extract (Python):** downloads the bulk files, filters them to defense scope, and trims them to the 65 columns the schema needs. Raw zips and prestaged CSVs land in S3.
- **Load (Redshift Serverless):** `COPY` into all-varchar raw tables. Each file is tagged with its S3 key, so reruns are idempotent. After the first full load, only monthly change files are loaded.
- **Transform (dbt):** staging casts types, dedupes, and applies deletes. The marts are a star schema of seven dimensions and a transaction fact table. The recipient dimension is SCD Type 2, consolidating 459K inconsistent parent-company changes into 153K versions. 90+ data tests guard quality.
- **Orchestrate (Airflow in Docker):** runs monthly after USASpending publishes. Extracts run in parallel, then load and dbt, opening and closing Redshift network access around them.

![Airflow DAG: four parallel extract tasks, then open Redshift access, load, dbt build, and close Redshift access](./airflow_dag.png)

![dbt lineage graph: raw source to staging, seven dimensions and the fact table, an intermediate awards model, and the reporting tables](./dbt_lineage.png)

## Findings

A six-page Power BI dashboard and written findings answer 20+ questions. A few:

- Contract obligations grew 55% from FY2017 to FY2025 ($340B to $526B), but only about 18% after inflation.
- Most money flows through existing contracts: 55% to 62% of each year's dollars fund awards already in place. Brand new contracts get only 9% to 14%.
- Mergers didn't speed up growth: four of five major defense mergers lost contract share after the deal.
- DoD puts about 15.5% of its annual contract dollars into September, nearly double an even month.

Full findings, caveats, and the query behind each answer are in the repo.
