# Saathi — AI-Powered Predictive Inference & Multi-Platform Price Aggregation Pipeline

Saathi is an intelligent multi-tenant price prediction and algorithmic comparison ecosystem engineered using Python and predictive machine learning architectures. 

The platform aggregates real-time pricing data across decoupled services, executing regression models to evaluate market stability and predict localized cost fluctuations to optimize consumer purchasing decisions.

By eliminating manual app-to-app data fragmentation, Saathi centralizes distributed pricing matrices into a unified analytical engine—providing predictive cost estimation, deal scoring, and automated platform evaluation in a single interface.

---

# Project Overview

Saathi was developed to solve a common real-world problem:
> Users often spend significant time comparing prices across multiple applications before making a purchase or booking decision.

This system addresses this operational friction by combining:
- Real-time distributed data aggregation
- Predictive price trend forecasting via Linear Regression
- Automated deal-quality scoring algorithms
- Multi-variable cost optimization metrics

By deploying predictive analytics against historical and sample market variables, the system estimates pricing trajectories, helping users capitalize on optimal cost-saving thresholds.

---

# Integrated Platforms & Core Domains

## Mobility & Transport Nodes
- Uber API Ecosystem
- Ola Shared Mobility
- Rapido Logistics Network

## On-Demand Delivery Frameworks
- Swiggy Food Logistics
- Zomato Delivery Infrastructure

## Digital Commerce Aggregators
- Amazon Core Retail
- Flipkart Marketplace
- Myntra Digital Apparel
- Croma Electronics Inventory

---

# Key Features & Technical Capabilities

- **Distributed Data Aggregation:** Seamlessly structures and indexes varying pricing payload formats from disparate platform schemas.
- **Predictive Inference Engine:** Leverages optimized Linear Regression models to evaluate and forecast pricing trajectories based on historical sample trends.
- **Algorithmic Decision Scoring:** Evaluates real-time price deltas against predictive forecasts to dynamically rank current deals.
- **Cost-Optimization Metrics:** Computes cost-benefit thresholds to recommend whether to execute a real-time transaction or wait for projected price regressions.
- **Domain-Isolated Input Processing:** Utilizes a modular routing layer to handle domain-specific parameters (e.g., geospatial coordinates for mobility vs. product IDs for commerce).
- **Decoupled Backend Architecture:** Powered by a clean Django MVC pattern for asynchronous request orchestration and analytical throughput.

---

# Execution Pipeline & Architectural Workflow

## Example Vector — Mobility Domain Inference

### Feature Vector Inputs
- Geospatial Origin Coordinate (Pickup Location)
- Geospatial Destination Coordinate (Drop Location)
- Vehicle Class/Tier Parameter

### System Pipeline Processing
1. **Ingestion:** Programmatically captures and parses spatial routing variables via the unified interface.
2. **Aggregation:** Fetches concurrent ride-fare matrices across competing distribution endpoints.
3. **Feature Preprocessing:** Normalizes raw cost strings and aligns them into tabular matrices for clean computation.
4. **Model Inference:** Passes the data vectors into the predictive model to calculate trend slopes and price thresholds.
5. **Optimization Output:** Dispatches the optimal platform endpoint, deal classification score, and predictive execution recommendation to the client view.

---

# Machine Learning & Analytical Layer

The system runtime incorporates:
- **Linear Regression Modality:** Deployed for continuous value price trend estimation and cost trajectory forecasting.
- **Data Engineering Pipelines:** Built-in data cleaning, schema scaling, and data normalization using Pandas and NumPy.
- **Synthetic/Sample Dataset Validation:** Leverages mock data matrices to mimic live API payloads and evaluate model baseline reliability.

The analytical stack assesses:
- Expected pricing volatilities.
- Historical trend alignments.
- Delta computations between real-time prices and statistical baselines.

---

# Technical Stack

## Language & Core Infrastructure
- Python 3.x

## Data Engineering & Core Processing
- Pandas (Data Frame alignment & preprocessing)
- NumPy (High-performance multi-dimensional array computation)

## Predictive Modeling Layer
- Scikit-learn (Statistical modeling & Regression modeling)

## API & Schema Architecture
- GraphQL / Decoupled Data Routines

## User Interface Configuration
- HTML5, CSS3, JavaScript (Asynchronous DOM state management)

---

# Output Graphics & Analytics

## Centralized Workspace Interface

<img width="100%" alt="Centralized Analytical Workspace" src="Images/Home page.png">

---

## Predictive Inference & Aggregation Matrix

<img width="100%" alt="Predictive Price Engine Matrix Output" src="Images/Prediction Output.png">
