"""운전자 프로필 API.

  GET  /api/users/profile/        → 최근 저장 프로필 1건 (없으면 204)
  GET  /api/users/profile/?id=3   → 해당 id 프로필
  POST /api/users/profile/        → 프로필 저장(생성) → 201 + id

로그인/세션이 없는 단계라 '최근 1건'을 현재 사용자로 간주한다(데모 전제).
설계: docs/FE_백엔드_연동_설계.md
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import DriverProfile
from .serializers import DriverProfileSerializer


@api_view(['GET', 'POST'])
def profile(request):
    if request.method == 'POST':
        serializer = DriverProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # GET — id 지정이면 그 프로필, 아니면 가장 최근 1건
    profile_id = request.query_params.get('id')
    if profile_id:
        try:
            obj = DriverProfile.objects.get(pk=profile_id)
        except (DriverProfile.DoesNotExist, ValueError):
            return Response({'detail': '프로필을 찾을 수 없습니다.'},
                            status=status.HTTP_404_NOT_FOUND)
    else:
        obj = DriverProfile.objects.order_by('-created_at').first()
        if obj is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(DriverProfileSerializer(obj).data)
