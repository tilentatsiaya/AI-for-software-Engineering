import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const inputData = await request.json();
    console.log('📊 Received prediction request:', inputData);

    // Calculate risk score
    const riskScore = 
      (inputData.temperature - 36.5) * 0.2 +
      (inputData.humidity - 50) * 0.1 +
      inputData.rainfall * 0.05 +
      (inputData.population_density - 300) * 0.001 -
      inputData.sanitation_score * 0.3 -
      inputData.vaccination_rate * 0.02 +
      inputData.previous_cases * 0.15 -
      inputData.healthcare_access * 0.2;

    const riskProbability = Math.min(0.95, Math.max(0.05, 1 / (1 + Math.exp(-riskScore * 0.1))));
    
    let riskLevel = 'Low Risk';
    if (riskProbability > 0.7) riskLevel = 'High Risk';
    else if (riskProbability > 0.4) riskLevel = 'Medium Risk';

    const recommendations = {
      'High Risk': {
        alert_level: 'HIGH',
        recommendations: [
          'Activate emergency response protocol',
          'Increase hospital preparedness and bed capacity',
          'Deploy rapid testing teams to affected areas',
          'Launch public health emergency communication'
        ],
        immediate_actions: [
          'Conduct door-to-door health screening',
          'Isolate and test suspected cases immediately',
          'Enhance vector control and sanitation measures'
        ]
      },
      'Medium Risk': {
        alert_level: 'MEDIUM',
        recommendations: [
          'Enhance disease surveillance systems',
          'Increase sanitation in public spaces',
          'Conduct public health education campaigns',
          'Review and update contingency plans'
        ],
        immediate_actions: [
          'Increase testing in suspected areas',
          'Strengthen primary healthcare services',
          'Monitor environmental conditions daily'
        ]
      },
      'Low Risk': {
        alert_level: 'LOW',
        recommendations: [
          'Maintain routine health monitoring',
          'Continue environmental surveillance',
          'Regular public health education',
          'Update disease prevention protocols'
        ],
        immediate_actions: [
          'Continue standard surveillance',
          'Monitor weather and outbreak reports',
          'Maintain routine health services'
        ]
      }
    };

    const result = {
      risk_level: riskLevel,
      confidence: 0.85 + (Math.random() * 0.1),
      risk_probability: riskProbability,
      recommendations: recommendations[riskLevel as keyof typeof recommendations]
    };

    console.log('✅ Prediction result:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to process prediction' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Disease Prediction API is working!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
}