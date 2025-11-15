import pandas as pd
import numpy as np
from typing import Dict, Any

def validate_input_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and sanitize input data"""
    required_fields = [
        'temperature', 'humidity', 'rainfall', 'population_density',
        'sanitation_score', 'previous_cases', 'vaccination_rate', 'healthcare_access'
    ]
    
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {'error': f'Missing fields: {missing_fields}'}
    
    validations = {
        'temperature': (35, 42),
        'humidity': (0, 100),
        'rainfall': (0, 1000),
        'population_density': (0, 5000),
        'sanitation_score': (0, 10),
        'previous_cases': (0, 1000),
        'vaccination_rate': (0, 100),
        'healthcare_access': (0, 10)
    }
    
    for field, (min_val, max_val) in validations.items():
        value = data[field]
        if not (min_val <= value <= max_val):
            return {'error': f'{field} must be between {min_val} and {max_val}'}
    
    return {'valid': True, 'data': data}

def generate_risk_recommendations(risk_level: str, confidence: float) -> Dict[str, Any]:
    """Generate recommendations based on risk level"""
    if risk_level == 'High Risk':
        return {
            'alert_level': 'HIGH',
            'recommendations': [
                'Increase health surveillance in the area',
                'Stockpile necessary medications and supplies',
                'Launch public health awareness campaign',
                'Coordinate with regional health authorities',
                'Prepare emergency response teams'
            ],
            'immediate_actions': [
                'Conduct rapid diagnostic testing',
                'Isolate suspected cases',
                'Enhance vector control measures'
            ]
        }
    else:
        return {
            'alert_level': 'LOW',
            'recommendations': [
                'Maintain routine health monitoring',
                'Continue public health education',
                'Ensure adequate supply of preventive materials',
                'Regularly update contingency plans'
            ],
            'immediate_actions': [
                'Continue standard surveillance',
                'Monitor weather and environmental changes'
            ]
        }
