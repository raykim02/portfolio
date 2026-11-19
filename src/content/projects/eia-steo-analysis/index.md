---
title: EIA Short-Term Energy Outlook Analysis
summary: A Python pipeline that pulls the EIA's Short-Term Energy Outlook to analyze Texas shale oil production trends, outlier years, and how production responds to price.
date: 2026-08-18
status: complete
tags: [Python, pandas, Matplotlib, EIA API]
github: https://github.com/raykim02/eia-steo-analysis
cover: ./volGraph.png
coverAlt: Line chart of crude oil production in million barrels per day for Eagle Ford, the Permian Basin, and the U.S. total, from 1990 through EIA's projections
---

## Problem

How did Texas's two big shale plays, the Permian Basin and Eagle Ford, shape U.S. crude oil production, and does production follow price? I pulled the U.S. Energy Information Administration's Short-Term Energy Outlook (monthly-updated, 18-month-ahead forecasts) through the EIA API to find out.

## How it's built

![Architecture: the EIA STEO API feeds a Python pipeline that cleans, reshapes, and computes metrics, producing CSV exports and a chart](./architecture.svg)

I started with an exploratory script, then refactored it into a reusable pipeline of discrete steps: extract, clean, reshape, compute metrics (share of U.S. production, growth rates, z-scores), compute lagged price correlation, generate the chart, and export results to CSV.

## Findings

- **The Permian dominates.** Eagle Ford drove the early shale boom, but the Permian Basin became the dominant producer from 2014 on and is projected to account for roughly 50% of total U.S. crude production by 2027.
- **Two outlier years stand out:** 2011 for Eagle Ford (z = 3.27, 217% growth) and 2018 for the Permian (z = 2.84, 40% growth), matching each play's boom period.
- **Price alone is a weak predictor of production.** Nationally, the correlation rises slightly with lag (r = 0.30 at zero lag to 0.38 at 12 months), consistent with drilling taking months. The individual plays don't follow that pattern, which suggests technology, capacity, and basin maturity matter more.

The repo has the full outlier analysis, the correlation table by lag, and the cleaned data exports.

## What I learned

- **The business behind the data.** I work in the crude oil midstream sector, and this project helped me understand the history of the Texas shale boom and gave me a foundational understanding of my company's work. It was interesting to connect the data to the stories our truck drivers tell me about their experiences through the industry's ups and downs. The data gave me a clearer picture of the business as a whole and helped me ask better questions.
- **What I'd do differently.** This was my first data engineering project. If I did it again, I'd go beyond crude oil to other energy products like natural gas and propane, cover every U.S. region, and run it on AWS with S3, Lambda, and Athena.
