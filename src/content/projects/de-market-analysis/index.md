---
title: Data Engineering Market Analysis
summary: A dbt and DuckDB pipeline comparing wages, job concentration, and cost of living for data-engineering-adjacent roles across five U.S. metros, using BLS and Census data.
date: 2026-09-23
status: complete
tags: [Python, dbt, DuckDB, AWS S3, BLS API, Census API]
github: https://github.com/raykim02/de-market-analysis
---

## Problem

Which metro is actually the best place to work in data engineering once cost of living is factored in? I compared five metros (Austin, Seattle, Chicago, Washington DC, and New York) on labor market, wages, and cost of living, using three public sources:

- **BLS LAUS:** monthly unemployment and labor force per metro, via the BLS API.
- **BLS OEWS:** employment and wages for four data-engineering-adjacent occupations (Database Administrator, Database Architect, Data Scientist, Software Developer) per metro, from BLS's bulk flat files (340 series).
- **Census ACS:** income, rent, and home value per metro.

There's no official occupation code for data engineer, so Database Administrator and Database Architect are the closest (imperfect) proxies.

## How it's built

![Architecture: BLS and Census sources are extracted with Python into DuckDB, transformed by dbt through staging, intermediate, and mart layers, and exported as CSVs](./architecture.svg)

- **Extract (Python):** pulls LAUS and ACS from their APIs and OEWS from flat files, loading raw data into a local DuckDB database. Raw LAUS and OEWS files are also uploaded to S3.
- **Transform (dbt on DuckDB):** staging views clean and type each source, intermediate views pivot series to wide tables, and mart tables build a metro dimension, labor market, occupation, and cost-of-living facts, plus comparison marts like wage vs. cost of living.
- **Output:** the final marts are exported to CSV so results can be reviewed without running the pipeline.

## Findings

- **Cost of living changes the picture.** Chicago offers the best affordability across every occupation, including Database Administrator, despite having the lowest raw DBA wage of the five metros. DC and Seattle pay competitively but show the worst DBA affordability once rent and home values are factored in.

Database Administrators, most to least affordable:

| Metro | DBA mean wage | Rent as % of wage | Years of wages to buy a home |
|---|--:|--:|--:|
| Chicago | $111,210 | 15.4% | 2.9 |
| Austin | $117,420 | 17.6% | 4.0 |
| New York | $125,550 | 17.5% | 4.9 |
| DC | $119,320 | 20.4% | 4.9 |
| Seattle | $131,460 | 18.3% | 5.5 |

Rent as % of wage is a year of rent divided by mean wage; years to buy is home value divided by mean wage. Full results for all four occupations: [mart_wage_vs_col.csv](https://github.com/raykim02/de-market-analysis/blob/main/output/mart_wage_vs_col.csv).

- **DC has the highest Database Architect concentration** of any metro, about 3.5 times the national average.
- **Austin is more software-heavy than Chicago.** Chicago has more software developers (40,370 vs. 31,960), but they're a much smaller share of its economy (location quotient 0.82 vs. 2.28).
- **Wages track job count more than concentration:** annual mean wage correlates more with employment count (r = 0.65) than with location quotient (r = 0.46).

OEWS data is a 2025 snapshot and cost-of-living data lags one to two years, so comparisons are approximate. Full notes and caveats are in the repo.
