'use client';

import { useState } from 'react';

export default function Home() {
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
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const testAPI = async () => {
    try {
      setApiStatus('Testing...');
      console.log('🔍 Testing API connection...');
      const response = await fetch('/api/predict');
      const data = await response.json();
      console.log('✅ API Test Response:', data);
      setApiStatus(`✅ API Working: ${data.message}`);
    } catch (error) {
      console.error('❌ API Test Failed:', error);
      setApiStatus('❌ API Connection Failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('📤 Submitting form data:', formData);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📊 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setResult(data);
      
    } catch (error) {
      console.error('❌ Prediction error:', error);
      setResult({
        risk_level: 'Error',
        confidence: 0,
        risk_probability: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🦠 Disease Outbreak Prediction System</h1>
        <p style={styles.subtitle}>SDG 3: Good Health and Well-being</p>
        
        <div style={styles.apiSection}>
          <button onClick={testAPI} style={styles.testButton}>
            Test API Connection
          </button>
          <span style={styles.apiStatus}>{apiStatus}</span>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.formSection}>
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Enter Health Data</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} style={styles.inputGroup}>
                    <label style={styles.label}>
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={value}
                      onChange={handleChange}
                      style={styles.input}
                      step={key === 'temperature' ? 0.1 : 1}
                      required
                    />
                  </div>
                ))}
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading && styles.loadingButton)
                }}
              >
                {loading ? '🔮 Predicting...' : '🔍 Predict Outbreak Risk'}
              </button>
            </form>
          </div>
        </div>

        <div style={styles.resultsSection}>
          {result ? (
            <div style={{
              ...styles.resultCard,
              ...(result.risk_level === 'High Risk' && styles.highRisk),
              ...(result.risk_level === 'Medium Risk' && styles.mediumRisk),
              ...(result.risk_level === 'Low Risk' && styles.lowRisk),
              ...(result.error && styles.errorCard)
            }}>
              <h3 style={styles.resultTitle}>Prediction Results</h3>
              
              {result.error ? (
                <div style={styles.errorBox}>
                  <h4 style={styles.errorTitle}>Error</h4>
                  <p style={styles.errorText}>{result.error}</p>
                </div>
              ) : (
                <>
                  <div style={styles.metrics}>
                    <div style={styles.metric}>
                      <span style={styles.metricLabel}>Risk Level:</span>
                      <span style={{
                        ...styles.metricValue,
                        ...(result.risk_level === 'High Risk' && styles.highRiskValue),
                        ...(result.risk_level === 'Medium Risk' && styles.mediumRiskValue),
                        ...(result.risk_level === 'Low Risk' && styles.lowRiskValue)
                      }}>
                        {result.risk_level}
                      </span>
                    </div>
                    <div style={styles.metric}>
                      <span style={styles.metricLabel}>Confidence:</span>
                      <span style={styles.confidenceValue}>
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div style={styles.metric}>
                      <span style={styles.metricLabel}>Risk Probability:</span>
                      <span style={styles.probabilityValue}>
                        {(result.risk_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {result.recommendations && (
                    <div style={styles.recommendations}>
                      <h4 style={styles.recommendationsTitle}>📋 Recommendations</h4>
                      <ul style={styles.list}>
                        {result.recommendations.recommendations.map((item: string, index: number) => (
                          <li key={index} style={styles.listItem}>{item}</li>
                        ))}
                      </ul>
                      
                      <h4 style={styles.recommendationsTitle}>⚡ Immediate Actions</h4>
                      <ul style={styles.list}>
                        {result.recommendations.immediate_actions.map((item: string, index: number) => (
                          <li key={index} style={styles.listItem}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div style={styles.placeholderCard}>
              <h3 style={styles.placeholderTitle}>No Prediction Yet</h3>
              <p style={styles.placeholderText}>
                Enter health data and click "Predict Outbreak Risk" to see results.
              </p>
              <div style={styles.infoBox}>
                <p>💡 Open browser console (F12) to see debug information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    color: 'white'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    marginBottom: '20px'
  },
  apiSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '20px'
  },
  testButton: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  apiStatus: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  formSection: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
  },
  formCard: {
    width: '100%'
  },
  formTitle: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '1.5rem',
    textAlign: 'center' as const
  },
  form: {
    width: '100%'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '14px'
  },
  input: {
    padding: '12px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s'
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s'
  },
  loadingButton: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  resultsSection: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
  },
  resultCard: {
    padding: '20px',
    borderRadius: '12px',
    border: '3px solid #e5e7eb'
  },
  highRisk: {
    background: '#fef2f2',
    borderColor: '#fecaca'
  },
  mediumRisk: {
    background: '#fefce8',
    borderColor: '#fef08a'
  },
  lowRisk: {
    background: '#f0fdf4',
    borderColor: '#bbf7d0'
  },
  errorCard: {
    background: '#fef2f2',
    borderColor: '#fca5a5'
  },
  resultTitle: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '1.5rem',
    textAlign: 'center' as const
  },
  errorBox: {
    background: '#fee2e2',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #fecaca'
  },
  errorTitle: {
    color: '#dc2626',
    marginBottom: '10px',
    fontSize: '1.1rem'
  },
  errorText: {
    color: '#b91c1c'
  },
  metrics: {
    marginBottom: '25px'
  },
  metric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '12px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  metricLabel: {
    fontWeight: 'bold',
    color: '#555'
  },
  metricValue: {
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  highRiskValue: {
    color: '#dc2626'
  },
  mediumRiskValue: {
    color: '#d97706'
  },
  lowRiskValue: {
    color: '#16a34a'
  },
  confidenceValue: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  probabilityValue: {
    color: '#ea580c',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  recommendations: {
    marginTop: '20px'
  },
  recommendationsTitle: {
    marginBottom: '12px',
    color: '#333',
    fontSize: '1.1rem'
  },
  list: {
    marginLeft: '20px',
    marginBottom: '20px'
  },
  listItem: {
    marginBottom: '8px',
    color: '#555',
    lineHeight: '1.4'
  },
  placeholderCard: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#666'
  },
  placeholderTitle: {
    marginBottom: '15px',
    fontSize: '1.3rem',
    color: '#333'
  },
  placeholderText: {
    fontSize: '1rem',
    marginBottom: '20px'
  },
  infoBox: {
    background: '#eff6ff',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #bfdbfe'
  }
};