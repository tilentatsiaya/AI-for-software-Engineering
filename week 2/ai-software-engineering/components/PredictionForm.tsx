'use client';
import React, { useState } from 'react';
import styles from '../styles/PredictionForm.module.css';

interface PredictionResult {
  risk_level: string;
  confidence: number;
  risk_probability: number;
  recommendations: {
    alert_level: string;
    recommendations: string[];
    immediate_actions: string[];
  };
}

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    temperature: 37.0,
    humidity: 60,
    rainfall: 10,
    population_density: 500,
    sanitation_score: 7,
    previous_cases: 5,
    vaccination_rate: 75,
    healthcare_access: 6
  });
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? '' : Number(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: val
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setResult(json);
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const progressFillClass = (p: number) =>
    p > 0.6 ? `${styles.progressFill} ${styles.fillHigh}`
    : p > 0.3 ? `${styles.progressFill} ${styles.fillMedium}`
    : `${styles.progressFill} ${styles.fillLow}`;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>Temperature (°C)</label>
            <input className={styles.input} name="temperature" type="number" step="0.1" value={String(formData.temperature)} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Humidity (%)</label>
            <input className={styles.input} name="humidity" type="number" value={String(formData.humidity)} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Rainfall (mm)</label>
            <input className={styles.input} name="rainfall" type="number" value={String(formData.rainfall)} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Population density (per km²)</label>
            <input className={styles.input} name="population_density" type="number" value={String(formData.population_density)} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Sanitation score (1-10)</label>
            <input className={styles.input} name="sanitation_score" type="number" step="0.1" value={String(formData.sanitation_score)} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Previous cases</label>
            <input className={styles.input} name="previous_cases" type="number" value={String(formData.previous_cases)} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Vaccination rate (%)</label>
            <input className={styles.input} name="vaccination_rate" type="number" value={String(formData.vaccination_rate)} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Healthcare access (1-10)</label>
            <input className={styles.input} name="healthcare_access" type="number" step="0.1" value={String(formData.healthcare_access)} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Predicting…' : 'Run Prediction'}</button>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { setResult(null); setError(null); }} disabled={loading}>Clear</button>
        </div>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {result && (
        <div className={styles.resultCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{result.risk_level}</strong>
            <span className={styles.smallMuted}>Confidence: {(result.confidence * 100).toFixed(0)}%</span>
          </div>

          <div style={{ marginTop: 8 }}>
            <div className={styles.smallMuted}>Risk probability</div>
            <div className={styles.progressWrap}>
              <div
                className={progressFillClass(result.risk_probability)}
                style={{ width: `${Math.round(result.risk_probability * 100)}%` }}
              />
            </div>
            <div style={{ marginTop: 6 }}>{(result.risk_probability * 100).toFixed(1)}%</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div className={styles.smallMuted}>Recommendations</div>
            <ul>
              {result.recommendations.recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
            <div style={{ marginTop: 8 }}>
              <div className={styles.smallMuted}>Immediate actions</div>
              <ul>
                {result.recommendations.immediate_actions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
