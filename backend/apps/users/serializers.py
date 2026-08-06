"""DriverProfile 직렬화 — FE(S1 프로필 화면) ↔ DB.

고정 프로필 4필드만 다룬다. passenger·load_kg 는 여정별 값이라
프로필로 저장하지 않고 추천 요청에서 받는다(docs/FE_백엔드_연동_설계.md).
"""
from rest_framework import serializers

from .models import DriverProfile


class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverProfile
        fields = ['id', 'age', 'gender', 'car_type', 'car_age', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_age(self, value):
        if not (1 <= value <= 120):
            raise serializers.ValidationError('나이는 1~120 사이여야 합니다.')
        return value

    def validate_car_age(self, value):
        if not (0 <= value <= 10):
            raise serializers.ValidationError('차량 연식은 0~10년 범위입니다.')
        return value
