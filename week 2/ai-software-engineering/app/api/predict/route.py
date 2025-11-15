from src.predict import DiseasePredictor
from lib.utils import validate_input_data, generate_risk_recommendations
import json

predictor = DiseasePredictor()

async def POST(request):
    try:
        data = await request.json()
        
        validation = validate_input_data(data)
        if 'error' in validation:
            return Response(
                json.dumps({'error': validation['error']}),
                status=400,
                headers={'Content-Type': 'application/json'}
            )
        
        prediction_result = predictor.predict(validation['data'])
        
        if 'error' in prediction_result:
            return Response(
                json.dumps({'error': prediction_result['error']}),
                status=500,
                headers={'Content-Type': 'application/json'}
            )
        
        recommendations = generate_risk_recommendations(
            prediction_result['risk_level'],
            prediction_result['confidence']
        )
        
        final_result = {
            **prediction_result,
            'recommendations': recommendations
        }
        
        return Response(
            json.dumps(final_result),
            status=200,
            headers={'Content-Type': 'application/json'}
        )
        
    except Exception as e:
        return Response(
            json.dumps({'error': f'Internal server error: {str(e)}'}),
            status=500,
            headers={'Content-Type': 'application/json'}
        )
