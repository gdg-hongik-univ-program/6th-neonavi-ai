"""Two-Tower 성향 추론 모델.

- User Tower: 운전자 프로필 → 성향 가중치 w (softmax, 합=1, 4축=[속도,편안함,연비,안전])
- Route Tower: 경로 특성(표준화) → 축별 만족도 f (sigmoid, 0~1)
- Score = w · f  → 경로 랭킹 점수

학습 타깃은 pairwise: 두 경로 A/B 의 score 차를 sigmoid 해 P(A 선호)와 맞춘다(RankNet).
설계: docs/학습셋_설계.md, docs/Phase0_계약.md §3.
"""
import torch
import torch.nn as nn
import torch.nn.functional as F


class UserTower(nn.Module):
    """운전자 프로필 → 성향 가중치 벡터 w (softmax)."""

    def __init__(self, in_dim: int, out_dim: int = 4, hidden: int = 32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, out_dim),
        )

    def forward(self, x):
        return F.softmax(self.net(x), dim=-1)   # (B, 4) 합=1


class RouteTower(nn.Module):
    """경로 특성(표준화) → 축별 만족도 f (sigmoid, 0~1)."""

    def __init__(self, in_dim: int, out_dim: int = 4, hidden: int = 32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, out_dim),
        )

    def forward(self, x):
        return torch.sigmoid(self.net(x))       # (B, 4) 0~1


class TwoTower(nn.Module):
    def __init__(self, user_dim: int, route_dim: int, latent: int = 4, hidden: int = 32):
        super().__init__()
        self.user_tower = UserTower(user_dim, latent, hidden)
        self.route_tower = RouteTower(route_dim, latent, hidden)

    def weights(self, user_x):
        return self.user_tower(user_x)          # w (B, 4)

    def satisfaction(self, route_x):
        return self.route_tower(route_x)        # f (B, 4)

    def score(self, user_x, route_x):
        w = self.user_tower(user_x)
        f = self.route_tower(route_x)
        return (w * f).sum(dim=-1)              # (B,)

    def forward(self, user_x, route_a, route_b):
        """pairwise: (score_A - score_B) 로짓 반환. sigmoid 하면 P(A 선호)."""
        w = self.user_tower(user_x)
        fa = self.route_tower(route_a)
        fb = self.route_tower(route_b)
        return ((w * fa).sum(-1) - (w * fb).sum(-1))   # (B,) 로짓
