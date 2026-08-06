"""경로 추천 API.

  POST /api/routes/recommend/
    { profile:{age,gender,car_type,car_age}, passenger, load_kg,
      origin, destination, mode, auto_recommend }
  → { origin, destination, mode, routes:[{route_id,title,reason,score,...}] }

실제 파이프라인은 services.recommend 에 있다. 설계: docs/FE_백엔드_연동_설계.md
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import services


@api_view(['POST'])
def recommend(request):
    try:
        result = services.recommend(request.data)
    except services.RecommendError as exc:
        return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(result)
