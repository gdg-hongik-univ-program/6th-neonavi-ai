"""Two-Tower 성향 추론 모델 (뼈대).

- User Tower: 운전자 프로필(나이·성별·동승자·차종·짐·연식) → 성향 가중치 w
- Route Tower: 경로 특성(곡률·경사·연비·통행료 등) → 임베딩 f
- Score = w · f  → 경로 랭킹
"""
import torch
import torch.nn as nn


class UserTower(nn.Module):
    """운전자 프로필 → 성향 가중치 벡터 w."""

    def __init__(self, in_dim: int, out_dim: int = 4):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, 32), nn.ReLU(),
            nn.Linear(32, out_dim),
        )

    def forward(self, x):
        return self.net(x)  # (B, out_dim) = [속도, 편안함, 연비, 안전] 가중치


class RouteTower(nn.Module):
    """경로 특성 → 임베딩 f (성향 축과 정렬)."""

    def __init__(self, in_dim: int, out_dim: int = 4):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, 32), nn.ReLU(),
            nn.Linear(32, out_dim),
        )

    def forward(self, x):
        return self.net(x)


class TwoTower(nn.Module):
    def __init__(self, user_dim: int, route_dim: int, latent: int = 4):
        super().__init__()
        self.user_tower = UserTower(user_dim, latent)
        self.route_tower = RouteTower(route_dim, latent)

    def forward(self, user_x, route_x):
        w = self.user_tower(user_x)        # (B, latent)
        f = self.route_tower(route_x)      # (B, latent)
        return (w * f).sum(dim=-1)         # 경로 점수 (B,)
